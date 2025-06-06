from pydantic import BaseModel


class Arrangement(BaseModel):
    post_id: int
    worker_id: int | None


class Schedule(BaseModel):
    day: int
    arrangements: list[Arrangement]
