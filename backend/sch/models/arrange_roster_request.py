from pydantic import BaseModel, Field


class OffRequest(BaseModel):
    worker_id: int = Field(alias="workerId")
    days: list[int]


class ArrangeRosterRequest(BaseModel):
    tenant_id: int = Field(alias="tenantId")
    day_count: int = Field(alias="dayCount")
    offs: list[OffRequest]
