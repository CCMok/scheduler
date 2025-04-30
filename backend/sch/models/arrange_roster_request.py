from pydantic import BaseModel


class OffRequest(BaseModel):
    worker_id: int
    day: int


class ArrangeRosterRequest(BaseModel):
    offs: list[OffRequest]
