from pydantic import BaseModel


class PostsConstraintSetting(BaseModel):
    id: int
    constraint_type: str
    weighting: float
    post_ids: list[int]
