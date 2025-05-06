from sqlmodel import Field, Relationship, SQLModel


class PostWorker(SQLModel, table=True):
    __tablename__ = 'post_worker'
    id: int = Field(primary_key=True)
    post_id: int = Field(foreign_key='post.id')
    worker_id: int = Field(foreign_key='worker.id')


class Post(SQLModel, table=True):
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key="tenant.id")
    name: str
    workers: list['Worker'] = Relationship(back_populates='posts', link_model=PostWorker)


class Worker(SQLModel, table=True):
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key="tenant.id")
    name: str
    posts: list['Post'] = Relationship(back_populates='workers', link_model=PostWorker)
