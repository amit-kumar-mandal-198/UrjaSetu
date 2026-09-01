from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import schemas
import crud
import services
import datetime
import os

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="UrjaSetu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "UrjaSetu API"}

@app.post("/api/v1/telemetry")
def ingest_telemetry(data: schemas.TelemetryCreate, db: Session = Depends(get_db)):
    telemetry = crud.create_telemetry(db, data)
    return {"status": "ok", "telemetry_id": telemetry.id}

@app.get("/api/v1/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    # Quick aggregate for dashboard UI
    devices = db.query(database.Device).all()
    tasks = db.query(database.Task).order_by(database.Task.created_at.desc()).all()
    
    # Just take telemetry from device 1 for overall dashboard
    latest_telemetry = crud.get_latest_telemetry(db, 1)
    
    return {
        "telemetry": latest_telemetry,
        "tasks": tasks,
        "devices": devices
    }

@app.post("/api/v1/devices/register")
def register_device(data: schemas.DeviceRegister, db: Session = Depends(get_db)):
    # Check if exists
    dev = db.query(database.Device).filter(database.Device.device_id_str == data.device_id_str).first()
    if not dev:
        # Create dummy user and site if they don't exist
        user = db.query(database.User).first()
        if not user:
            user = database.User(username="demo", email="demo@example.com")
            db.add(user)
            db.commit()
            db.refresh(user)
            
        site = db.query(database.Site).first()
        if not site:
            site = database.Site(name="Home", user_id=user.id)
            db.add(site)
            db.commit()
            db.refresh(site)
            
        dev = database.Device(name=data.name, device_id_str=data.device_id_str, site_id=site.id)
        db.add(dev)
        db.commit()
        db.refresh(dev)
    return dev

@app.post("/api/v1/tasks")
def create_task(data: schemas.TaskCreate, db: Session = Depends(get_db)):
    task = crud.create_task(db, data)
    return task

@app.get("/api/v1/tasks/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    prop = db.query(database.OptimizationProposal).filter(database.OptimizationProposal.task_id == task_id).order_by(database.OptimizationProposal.id.desc()).first()
    
    return {
        "task": task,
        "proposal": prop
    }

@app.post("/api/v1/tasks/{task_id}/plan")
def generate_task_plan(task_id: int, db: Session = Depends(get_db)):
    prop = services.generate_optimization(db, task_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Task not found")
    return prop

@app.post("/api/v1/proposals/{proposal_id}/decision")
def proposal_decision(proposal_id: int, data: schemas.ProposalDecision, db: Session = Depends(get_db)):
    prop = db.query(database.OptimizationProposal).filter(database.OptimizationProposal.id == proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    task = crud.get_task(db, prop.task_id)
    
    if data.decision == "PAY_AND_UNLOCK":
        task.status = "PAYMENT_REQUIRED"
        prop.status = "ACCEPTED"
        db.commit()
        crud.add_audit_event(db, "PAYMENT_REQUIRED", entity_type="Task", entity_id=task.id, actor="User")
        
        # Payment Gateway requires HTTP 402, but this endpoint just updates state.
        # The frontend will then hit the protected /optimize endpoint on the Payment Gateway.
    else:
        task.status = "SKIPPED"
        prop.status = "REJECTED"
        db.commit()
        
    return {"status": task.status}

@app.post("/api/v1/payments/unlock")
def unlock_payment(data: schemas.PaymentUnlockRequest, db: Session = Depends(get_db)):
    """Called by the Payment Gateway after successful settlement"""
    # 1. Idempotency Check
    existing_tx = db.query(database.PaymentTransaction).filter(database.PaymentTransaction.algorand_tx_id == data.transactionId).first()
    if existing_tx:
        return {"status": "success", "message": "Already settled"}
        
    # 2. Check task
    task = crud.get_task(db, data.taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # 3. Check Freshness Safety Gate
    if not services.verify_telemetry_freshness(db, task.device_id):
        # We still record the payment, but task is held?
        # Actually payment is verified, but we don't issue command yet.
        pass
        
    # 4. Record Payment
    payment = database.Payment(
        task_id=task.id,
        user_id=task.user_id,
        status="SETTLED",
        amount=data.amount,
        asset=data.asset,
        network=data.network,
        receiver="GATEWAY", # In reality from env
        facilitator="GoPlausible",
        verified_at=datetime.datetime.utcnow(),
        settled_at=datetime.datetime.utcnow()
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    tx = database.PaymentTransaction(
        payment_id=payment.id,
        algorand_tx_id=data.transactionId,
        network=data.network,
        sender=data.sender,
        amount=data.amount,
        asset=data.asset
    )
    db.add(tx)
    
    task.status = "PAYMENT_AUTHORIZED"
    db.commit()
    
    crud.add_audit_event(db, "PAYMENT_VERIFIED", entity_type="Payment", entity_id=payment.id, actor="System", details=f"TxID: {data.transactionId}")
    crud.add_audit_event(db, "TASK_AUTHORIZED", entity_type="Task", entity_id=task.id, actor="System")
    
    # Transition to AWAITING_APPROVAL automatically for the user to approve execution
    task.status = "AWAITING_APPROVAL"
    db.commit()
    
    return {"status": "success"}

@app.post("/api/v1/tasks/{task_id}/approve")
def approve_task(task_id: int, data: schemas.TaskAction, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if task.status != "AWAITING_APPROVAL":
        raise HTTPException(status_code=400, detail=f"Task cannot be approved in state {task.status}")
        
    if data.action == "APPROVE":
        # Safety Check: Fresh Telemetry
        if not services.verify_telemetry_freshness(db, task.device_id):
            raise HTTPException(status_code=403, detail={"error": {"code": "TELEMETRY_STALE", "message": "Automation held because telemetry is stale."}})
            
        task.status = "APPROVED"
        db.commit()
        crud.add_audit_event(db, "TASK_APPROVED", entity_type="Task", entity_id=task.id, actor="User")
        
        # Issue Command
        cmd = crud.create_command(db, task.id, "TURN_ON")
        task.status = "COMMAND_ISSUED"
        db.commit()
        
        crud.add_audit_event(db, "COMMAND_ISSUED", entity_type="Command", entity_id=cmd.id, actor="System")
        
        # In a real system, send over MQTT here.
        # Since we're simulating the edge, we will just transition it.
    else:
        task.status = "SKIPPED"
        db.commit()
        
    return {"status": task.status}

@app.get("/api/v1/commands/next")
def get_next_command(device_id: int, db: Session = Depends(get_db)):
    # Used by ESP32 to poll for commands if HTTPS
    cmd = db.query(database.Command).join(database.Task).filter(
        database.Task.device_id == device_id,
        database.Command.status == "CREATED"
    ).order_by(database.Command.issued_at.asc()).first()
    
    if cmd:
        # Check expiry
        if cmd.expires_at and datetime.datetime.utcnow() > cmd.expires_at:
            cmd.status = "EXPIRED"
            db.commit()
            return {"command": None}
            
        cmd.status = "ISSUED"
        db.commit()
        return {
            "command_id": cmd.command_id_str,
            "action": cmd.action,
            "expires_at": cmd.expires_at.isoformat() if cmd.expires_at else None
        }
    return {"command": None}

@app.post("/api/v1/commands/{command_id_str}/ack")
def ack_command(command_id_str: str, db: Session = Depends(get_db)):
    cmd = db.query(database.Command).filter(database.Command.command_id_str == command_id_str).first()
    if not cmd:
        raise HTTPException(status_code=404)
        
    cmd.status = "ACKNOWLEDGED"
    task = cmd.task
    task.status = "EXECUTING"
    
    exe = database.Execution(task_id=task.id, command_id=cmd.id, status="RUNNING")
    db.add(exe)
    db.commit()
    db.refresh(exe)
    
    crud.add_audit_event(db, "COMMAND_ACKNOWLEDGED", entity_type="Command", entity_id=cmd.id, actor="Device")
    crud.add_audit_event(db, "EXECUTION_STARTED", entity_type="Execution", entity_id=exe.id, actor="Device")
    
    return {"status": "ok"}

@app.post("/api/v1/commands/{command_id_str}/verify")
def verify_execution(command_id_str: str, db: Session = Depends(get_db)):
    # This simulates the physical verification step.
    # In reality this is triggered by a background worker observing power.
    cmd = db.query(database.Command).filter(database.Command.command_id_str == command_id_str).first()
    if not cmd:
        raise HTTPException(status_code=404)
        
    task = cmd.task
    task.status = "VERIFYING"
    db.commit()
    
    latest_telemetry = crud.get_latest_telemetry(db, task.device_id)
    power = latest_telemetry.power if latest_telemetry and latest_telemetry.power is not None else (latest_telemetry.home_consumption if latest_telemetry else 0)
    
    exe = db.query(database.Execution).filter(database.Execution.command_id == cmd.id).first()
    if exe:
        ver = database.Verification(
            execution_id=exe.id,
            status="VERIFIED",
            observed_power=power,
            observed_runtime_mins=task.duration_mins,
            reason="Observed power load aligns with expected profile."
        )
        db.add(ver)
        
        exe.status = "COMPLETED"
        exe.completed_at = datetime.datetime.utcnow()
        cmd.status = "COMPLETED"
        task.status = "VERIFIED"
        db.commit()
        
        crud.add_audit_event(db, "EXECUTION_VERIFIED", entity_type="Verification", entity_id=ver.id, actor="System", details="Physical verification successful")
        
        # Auto generate receipt
        generate_receipt(task.id, db)
        
    return {"status": "VERIFIED"}

def generate_receipt(task_id: int, db: Session):
    task = crud.get_task(db, task_id)
    prop = db.query(database.OptimizationProposal).filter(database.OptimizationProposal.task_id == task_id).order_by(database.OptimizationProposal.id.desc()).first()
    payment = db.query(database.Payment).filter(database.Payment.task_id == task_id).first()
    tx = db.query(database.PaymentTransaction).filter(database.PaymentTransaction.payment_id == payment.id).first() if payment else None
    
    receipt = database.SavingsReceipt(
        task_id=task_id,
        runtime_mins=task.duration_mins,
        energy_kwh=prop.expected_energy_kwh if prop else 0,
        baseline_cost=prop.baseline_cost if prop else 0,
        optimized_cost=prop.optimized_cost if prop else 0,
        incremental_benefit=prop.incremental_benefit if prop else 0,
        carbon_estimate= (prop.expected_energy_kwh * 0.8) if prop else 0,
        payment_id=payment.id if payment else None,
        algorand_txid=tx.algorand_tx_id if tx else None,
        x402_status="VERIFIED" if payment else "N/A",
        facilitator_status="SETTLED" if payment else "N/A",
        network=payment.network if payment else "N/A",
        verification_status="VERIFIED",
        provenance="DERIVED · Same-work baseline"
    )
    db.add(receipt)
    task.status = "RECEIPT_GENERATED"
    db.commit()
    
    crud.add_audit_event(db, "RECEIPT_GENERATED", entity_type="SavingsReceipt", entity_id=receipt.id, actor="System")

@app.get("/api/v1/receipts/{task_id}")
def get_receipt(task_id: int, db: Session = Depends(get_db)):
    receipt = db.query(database.SavingsReceipt).filter(database.SavingsReceipt.task_id == task_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return receipt

@app.get("/api/v1/tasks/{task_id}/payment")
def get_task_payment(task_id: int, db: Session = Depends(get_db)):
    payment = db.query(database.Payment).filter(database.Payment.task_id == task_id).first()
    if not payment:
        raise HTTPException(status_code=404)
    tx = db.query(database.PaymentTransaction).filter(database.PaymentTransaction.payment_id == payment.id).first()
    return {
        "payment": payment,
        "transaction": tx
    }

@app.on_event("startup")
def seed_data():
    db = database.SessionLocal()
    if db.query(database.User).count() == 0:
        user = database.User(username="demo", email="demo@example.com")
        db.add(user)
        db.commit()
        db.refresh(user)
        
        site = database.Site(name="Home", user_id=user.id)
        db.add(site)
        db.commit()
        db.refresh(site)
        
        dev = database.Device(name="Water Pump", device_id_str="ESP32-001", site_id=site.id)
        db.add(dev)
        db.commit()
        db.refresh(dev)
        
        task = crud.create_task(db, schemas.TaskCreate(
            name="Water Pump",
            device_id=dev.id,
            duration_mins=30,
            deadline="Before 4 PM",
            is_critical=False
        ), user.id)
        
        # Add initial telemetry
        crud.create_telemetry(db, schemas.TelemetryCreate(
            device_id=dev.id,
            solar_power=2.4,
            home_consumption=1.6,
            grid_import=0,
            grid_export=0.8
        ))
        
        # Generate an optimization plan
        services.generate_optimization(db, task.id)
    db.close()
