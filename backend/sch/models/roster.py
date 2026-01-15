from pydantic import BaseModel, ConfigDict, Field


class RosterTimeslotAssignment(BaseModel):
    model_config = ConfigDict(populate_by_name=True)  # Allow nullable field with alias

    post_id: int = Field(alias="postId")
    worker_id: int | None = Field(alias="workerId")


class RosterTimeslot(BaseModel):
    timeslot: str
    assignments: list[RosterTimeslotAssignment]
