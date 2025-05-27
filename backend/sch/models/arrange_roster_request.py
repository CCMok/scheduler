from pydantic import BaseModel, Field


class OffRequest(BaseModel):
    worker_id: int = Field(alias="workerId")
    days: list[int]


class ArrangeRosterRequest(BaseModel):
    department_id: int = Field(alias="departmentId")
    day_count: int = Field(alias="dayCount")
    offs: list[OffRequest]
