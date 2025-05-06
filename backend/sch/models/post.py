from sqlmodel import Field, SQLModel


class Post(SQLModel, table=True):
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key="tenant.id")
    name: str
