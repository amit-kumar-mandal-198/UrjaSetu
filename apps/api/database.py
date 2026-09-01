from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./urjasetu.db")

# SQLAlchemy 1.4+ requires postgresql:// instead of postgres://
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    sites = relationship("Site", back_populates="user")
    tasks = relationship("Task", back_populates="user")

class Site(Base):
    __tablename__ = "sites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="sites")
    devices = relationship("Device", back_populates="site")

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"))
    name = Column(String, index=True)
    device_id_str = Column(String, unique=True, index=True) # e.g. ESP32 MAC
    is_online = Column(Boolean, default=False)
    last_seen = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    site = relationship("Site", back_populates="devices")
    telemetry = relationship("Telemetry", back_populates="device")
    tasks = relationship("Task", back_populates="device")

class Telemetry(Base):
    __tablename__ = "telemetry"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    sequence = Column(Integer, nullable=True)
    voltage = Column(Float, nullable=True)
    current = Column(Float, nullable=True)
    power = Column(Float, nullable=True)
    solar_power = Column(Float, default=0.0)
    home_consumption = Column(Float, default=0.0)
    grid_import = Column(Float, default=0.0)
    grid_export = Column(Float, default=0.0)
    device_state = Column(String, nullable=True)
    operating_mode = Column(String, nullable=True)
    sensor_health = Column(String, nullable=True)
    faults = Column(String, nullable=True)

    device = relationship("Device", back_populates="telemetry")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_id = Column(Integer, ForeignKey("devices.id"))
    name = Column(String, index=True)
    status = Column(String) # CREATED, PLANNED, PAYMENT_REQUIRED, PAYMENT_AUTHORIZED, AWAITING_APPROVAL, APPROVED, COMMAND_ISSUED, EXECUTING, VERIFYING, VERIFIED, RECEIPT_GENERATED, SKIPPED, FAILED, EXPIRED, HOLD
    duration_mins = Column(Integer)
    deadline = Column(String)
    is_critical = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="tasks")
    device = relationship("Device", back_populates="tasks")
    proposals = relationship("OptimizationProposal", back_populates="task")
    payments = relationship("Payment", back_populates="task")
    commands = relationship("Command", back_populates="task")
    executions = relationship("Execution", back_populates="task")
    receipt = relationship("SavingsReceipt", back_populates="task", uselist=False)

class TaskPlan(Base):
    __tablename__ = "task_plans"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    scheduled_start = Column(DateTime, nullable=True)
    scheduled_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class OptimizationProposal(Base):
    __tablename__ = "optimization_proposals"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    recommended_window_start = Column(DateTime)
    recommended_window_end = Column(DateTime)
    expected_energy_kwh = Column(Float)
    baseline_cost = Column(Float)
    optimized_cost = Column(Float)
    incremental_benefit = Column(Float)
    reason = Column(String)
    confidence = Column(Float)
    status = Column(String) # PENDING, ACCEPTED, REJECTED, ADVICE_ONLY
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    task = relationship("Task", back_populates="proposals")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String) # REQUIRED, SIGNING, VERIFYING, SETTLING, SETTLED, FAILED, EXPIRED, REPLAY_BLOCKED
    amount = Column(Float)
    asset = Column(String)
    network = Column(String)
    receiver = Column(String)
    facilitator = Column(String)
    resource = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    settled_at = Column(DateTime, nullable=True)

    task = relationship("Task", back_populates="payments")
    transactions = relationship("PaymentTransaction", back_populates="payment")

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"
    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payments.id"))
    algorand_tx_id = Column(String, unique=True, index=True)
    network = Column(String)
    sender = Column(String)
    receiver = Column(String)
    amount = Column(Float)
    asset = Column(String)
    confirmed_at = Column(DateTime, default=datetime.datetime.utcnow)

    payment = relationship("Payment", back_populates="transactions")

class Command(Base):
    __tablename__ = "commands"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    command_id_str = Column(String, unique=True, index=True)
    action = Column(String)
    expected_state = Column(String)
    expected_power_min = Column(Float, nullable=True)
    expected_power_max = Column(Float, nullable=True)
    status = Column(String) # CREATED, ISSUED, ACKNOWLEDGED, EXECUTING, VERIFYING, COMPLETED, EXPIRED, REJECTED, FAILED, CANCELLED
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    task = relationship("Task", back_populates="commands")

class Execution(Base):
    __tablename__ = "executions"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    command_id = Column(Integer, ForeignKey("commands.id"))
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String) # PENDING, RUNNING, STOPPED
    
    task = relationship("Task", back_populates="executions")
    verifications = relationship("Verification", back_populates="execution")

class Verification(Base):
    __tablename__ = "verifications"
    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(Integer, ForeignKey("executions.id"))
    status = Column(String) # PENDING, OBSERVING, VERIFIED, FAILED, UNVERIFIED
    observed_power = Column(Float, nullable=True)
    observed_runtime_mins = Column(Float, nullable=True)
    reason = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    execution = relationship("Execution", back_populates="verifications")

class SavingsReceipt(Base):
    __tablename__ = "savings_receipts"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), unique=True)
    runtime_mins = Column(Float)
    energy_kwh = Column(Float)
    baseline_cost = Column(Float)
    optimized_cost = Column(Float)
    incremental_benefit = Column(Float)
    carbon_estimate = Column(Float)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=True)
    algorand_txid = Column(String, nullable=True)
    x402_status = Column(String)
    facilitator_status = Column(String)
    network = Column(String)
    verification_status = Column(String)
    provenance = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    task = relationship("Task", back_populates="receipt")

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String)
    actor = Column(String, nullable=True)
    entity_type = Column(String, nullable=True)
    entity_id = Column(Integer, nullable=True)
    metadata_json = Column(String, nullable=True)
    request_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String) # INFO, WARNING, ERROR, CRITICAL
    type = Column(String) # STALE_DATA, DEVICE_OFFLINE, SENSOR_FAULT, PAYMENT_FAILED, etc.
    message = Column(String)
    is_resolved = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
