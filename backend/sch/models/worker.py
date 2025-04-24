from pydantic import BaseModel


class Worker(BaseModel):
    id: int
    name: str
    post_ids: list[int]
