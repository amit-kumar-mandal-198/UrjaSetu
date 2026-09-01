from sqlalchemy.orm import Session
import database
import schemas
from datetime import datetime, timedelta

def get_device(db: Session, device_id: int):
    return db.query(database.Device).filter(database.Device.id == device_id).first()

def get_latest_telemetry(db: Session, device_id: int):
    return db.query(database.Telemetry).filter(database.Telemetry.device_id == device_id).order_by(database.Telemetry.timestamp.desc()).first()

def create_telemetry(db: Session, data: schemas.TelemetryCreate):
    db_item = database.Telemetry(**data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_task(db: Session, data: schemas.TaskCreate, user_id: int = 1):
    db_task = database.Task(
        name=data.name,
        device_id=data.device_id,
        duration_mins=data.duration_mins,
        deadline=data.deadline,
        is_critical=data.is_critical,
        user_id=user_id,
        status="CREATED"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Audit
    add_audit_event(db, "TASK_CREATED", entity_type="Task", entity_id=db_task.id, actor="User")
    return db_task

def get_task(db: Session, task_id: int):
    return db.query(database.Task).filter(database.Task.id == task_id).first()

def create_optimization_proposal(db: Session, task_id: int, proposal_data: dict):
    prop = database.OptimizationProposal(
        task_id=task_id,
        **proposal_data
    )
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop

def add_audit_event(db: Session, event_type: str, actor: str = None, entity_type: str = None, entity_id: int = None, details: str = None):
    evt = database.AuditEvent(
        event_type=event_type,
        actor=actor,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata_json=details
    )
    db.add(evt)
    db.commit()

def create_command(db: Session, task_id: int, action: str, expires_in_mins: int = 5):
    cmd = database.Command(
        task_id=task_id,
        command_id_str=f"CMD-{int(datetime.utcnow().timestamp())}",
        action=action,
        status="CREATED",
        expires_at=datetime.utcnow() + timedelta(minutes=expires_in_mins)
    )
    db.add(cmd)
    db.commit()
    db.refresh(cmd)
    return cmd
