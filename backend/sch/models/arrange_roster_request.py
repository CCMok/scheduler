from pydantic import BaseModel


class OffRequest(BaseModel):
    worker_id: int
    days: list[int]


class ArrangeRosterRequest(BaseModel):
    offs: list[OffRequest]
