from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TelemetryCreate(BaseModel):
    device_id: int
    solar_power: float
    home_consumption: float
    grid_import: float
    grid_export: float
    voltage: Optional[float] = None
    current: Optional[float] = None
    power: Optional[float] = None
    device_state: Optional[str] = None
    operating_mode: Optional[str] = None
    sensor_health: Optional[str] = None
    faults: Optional[str] = None
    sequence: Optional[int] = None

class TaskCreate(BaseModel):
    name: str
    device_id: int
    duration_mins: int
    deadline: str
    is_critical: bool = False

class ProposalDecision(BaseModel):
    decision: str # "PAY_AND_UNLOCK", "SKIP"

class PaymentUnlockRequest(BaseModel):
    taskId: int
    transactionId: str
    amount: float
    sender: str
    network: str
    asset: str

class DeviceRegister(BaseModel):
    name: str
    device_id_str: str

class TaskAction(BaseModel):
    action: str # "APPROVE", "SKIP"

class ReceiptGenerate(BaseModel):
    runtime_mins: float
    energy_kwh: float
    baseline_cost: float
    optimized_cost: float

class ErrorResponse(BaseModel):
    error: dict
