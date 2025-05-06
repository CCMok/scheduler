from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class PostDto(BaseModel):
    id: int
    name: str


class Post(SQLModel, table=True):
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key="tenant.id")
    name: str
