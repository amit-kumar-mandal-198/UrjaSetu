import crud
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

def generate_optimization(db: Session, task_id: int):
    task = crud.get_task(db, task_id)
    if not task:
        return None
        
    latest_telemetry = crud.get_latest_telemetry(db, task.device_id)
    
    # If no telemetry or telemetry is stale, we still generate a plan but maybe with low confidence
    is_telemetry_fresh = False
    if latest_telemetry:
        time_diff = datetime.utcnow() - latest_telemetry.timestamp
        if time_diff.total_seconds() <= 20:
            is_telemetry_fresh = True
            
    # Mocking optimization logic based on UI description
    solar = latest_telemetry.solar_power if latest_telemetry else 0
    home = latest_telemetry.home_consumption if latest_telemetry else 0
    surplus = max(0, solar - home)
    
    status = "PENDING"
    reason = "Solar surplus detected. Run now to maximize self-consumption."
    baseline = 40.0
    optimized = 16.0
    benefit = baseline - optimized
    
    if surplus < 0.5:
        reason = "No meaningful savings at the moment."
        status = "ADVICE_ONLY"
        benefit = 0
        optimized = baseline

    prop_data = {
        "recommended_window_start": datetime.utcnow(),
        "recommended_window_end": datetime.utcnow() + timedelta(minutes=task.duration_mins),
        "expected_energy_kwh": task.duration_mins * 0.05, # fake assumption
        "baseline_cost": baseline,
        "optimized_cost": optimized,
        "incremental_benefit": benefit,
        "reason": reason,
        "confidence": 0.95 if is_telemetry_fresh else 0.4,
        "status": status
    }
    
    prop = crud.create_optimization_proposal(db, task_id, prop_data)
    
    # Transition task state
    task.status = "PLANNED"
    db.commit()
    
    crud.add_audit_event(db, "PLAN_GENERATED", entity_type="OptimizationProposal", entity_id=prop.id, actor="System")
    return prop

def verify_telemetry_freshness(db: Session, device_id: int) -> bool:
    latest = crud.get_latest_telemetry(db, device_id)
    if not latest:
        return False
    time_diff = datetime.utcnow() - latest.timestamp
    return time_diff.total_seconds() <= 20
