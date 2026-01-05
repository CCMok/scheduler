from pydantic import BaseModel, Field


class OffRequest(BaseModel):
    worker_id: int = Field(alias="workerId")
    timeslots: list[str]


class ArrangeRosterRequest(BaseModel):
    team_id: int = Field(alias="teamId")
    timeslots: list[str]
    offs: list[OffRequest]
