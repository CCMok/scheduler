from pydantic import BaseModel


class PostsConstraintSetting(BaseModel):
    id: int
    constraint_type: str
    post_ids: list[int]
