from pydantic import BaseModel


class Post(BaseModel):
    id: int
    name: str
