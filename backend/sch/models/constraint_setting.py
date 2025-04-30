from pydantic import BaseModel


class ConstraintSettingBase(BaseModel):
    id: int
    constraint_type: str
    weighting: int


class PostsConstraintSetting(ConstraintSettingBase):
    post_ids: list[int]


class WorkersConstraintSetting(ConstraintSettingBase):
    worker_ids: list[int]
