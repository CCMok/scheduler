from datetime import datetime
from pydantic import BaseModel, Field


class OffRequest(BaseModel):
    worker_id: int = Field(alias="workerId")
    days: list[datetime]


class ArrangeRosterRequest(BaseModel):
    department_id: int = Field(alias="departmentId")
    days: list[datetime]
    offs: list[OffRequest]
