import sys
import datetime
from sqlalchemy.orm import Session
from database import SessionLocal, Device, Task, User, Site

def main():
    db = SessionLocal()
    
    user = db.query(User).first()
    site = db.query(Site).first()
    
    if not user or not site:
        print("Database not initialized.")
        return

    # Add EV Charger
    ev_charger = Device(
        site_id=site.id,
        name="EV Charger",
        device_id_str="MAC:EV:CHARGER",
        is_online=True,
        last_seen=datetime.datetime.utcnow()
    )
    db.add(ev_charger)
    db.commit()
    
    ev_task = Task(
        user_id=user.id,
        device_id=ev_charger.id,
        name="EV Charger",
        status="Pending approval",
        duration_mins=120,
        deadline="Before 6 AM",
        is_critical=False
    )
    db.add(ev_task)
    db.commit()

    # Add HVAC
    hvac = Device(
        site_id=site.id,
        name="HVAC Main",
        device_id_str="MAC:HVAC:MAIN",
        is_online=True,
        last_seen=datetime.datetime.utcnow()
    )
    db.add(hvac)
    db.commit()
    
    hvac_task = Task(
        user_id=user.id,
        device_id=hvac.id,
        name="HVAC Main",
        status="Running",
        duration_mins=0,
        deadline="Continuous",
        is_critical=True
    )
    db.add(hvac_task)
    db.commit()

    print("Devices added successfully!")

if __name__ == "__main__":
    main()
