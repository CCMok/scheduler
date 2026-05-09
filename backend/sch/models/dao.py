from sqlmodel import Field, Relationship, SQLModel
from typing import Optional


class Team(SQLModel, table=True):
    __tablename__ = 'team'
    id: int = Field(primary_key=True)
    owner_id: int = Field(foreign_key='user.id')
    name: str
    max_worker_assign_per_roster: Optional[int] = None


class PostWorker(SQLModel, table=True):
    __tablename__ = 'post_worker'
    id: int = Field(primary_key=True)
    post_id: int = Field(foreign_key='post.id')
    worker_id: int = Field(foreign_key='worker.id')
    priority: int = Field(default=0)


class PostAffinityMember(SQLModel, table=True):
    __tablename__ = 'post_affinity_member'
    id: int = Field(primary_key=True)
    post_affinity_id: int = Field(foreign_key='post_affinity.id')
    post_id: int = Field(foreign_key='post.id')

    post_affinity: 'PostAffinity' = Relationship(
        back_populates='members')
    post: 'Post' = Relationship(back_populates='post_affinity_members')


class Post(SQLModel, table=True):
    id: int = Field(primary_key=True)
    team_id: int = Field(foreign_key='team.id')
    name: str

    workers: list['Worker'] = Relationship(
        back_populates='posts', link_model=PostWorker)
    post_affinity_members: list['PostAffinityMember'] = Relationship(
        back_populates='post')


class WorkerAffinityMember(SQLModel, table=True):
    __tablename__ = 'worker_affinity_member'
    id: int = Field(primary_key=True)
    worker_affinity_id: int = Field(foreign_key='worker_affinity.id')
    worker_id: int = Field(foreign_key='worker.id')

    worker_affinity: 'WorkerAffinity' = Relationship(
        back_populates='members')
    worker: 'Worker' = Relationship(back_populates='worker_affinity_members')


class Worker(SQLModel, table=True):
    id: int = Field(primary_key=True)
    team_id: int = Field(foreign_key='team.id')
    name: str
    status: int

    posts: list['Post'] = Relationship(
        back_populates='workers', link_model=PostWorker)
    worker_affinity_members: list['WorkerAffinityMember'] = Relationship(
        back_populates='worker')


class PostAffinity(SQLModel, table=True):
    __tablename__ = 'post_affinity'
    id: int = Field(primary_key=True)
    team_id: int = Field(foreign_key='team.id')

    members: list['PostAffinityMember'] = Relationship(
        back_populates='post_affinity')


class WorkerAffinity(SQLModel, table=True):
    __tablename__ = 'worker_affinity'
    id: int = Field(primary_key=True)
    team_id: int = Field(foreign_key='team.id')

    members: list['WorkerAffinityMember'] = Relationship(
        back_populates='worker_affinity')
