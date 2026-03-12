from pydantic import BaseModel, ConfigDict, Field


class RosterPostTimeslot(BaseModel):
    model_config = ConfigDict(populate_by_name=True) 

    timeslot: str
    worker_id: int | None = Field(alias="workerId")


class RosterPost(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    post_id: int = Field(alias="postId")
    timeslots: list[RosterPostTimeslot]
