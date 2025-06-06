from pydantic import BaseModel, ConfigDict, Field


class Arrangement(BaseModel):
    model_config = ConfigDict(populate_by_name=True)  # Allow nullable field with alias

    post_id: int = Field(alias="postId")
    worker_id: int | None = Field(alias="workerId")


class Schedule(BaseModel):
    day: int
    arrangements: list[Arrangement]
