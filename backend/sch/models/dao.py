from sqlmodel import Field, Relationship, SQLModel
from decimal import Decimal
from typing import Optional


class Department(SQLModel, table=True):
    __tablename__ = 'department'
    id: int = Field(primary_key=True)
    organization_id: int = Field(foreign_key='organization.id')
    name: str
    max_worker_post_per_roster: Optional[int] = None


class PostWorker(SQLModel, table=True):
    __tablename__ = 'post_worker'
    id: int = Field(primary_key=True)
    post_id: int = Field(foreign_key='post.id')
    worker_id: int = Field(foreign_key='worker.id')
    priority: int = Field(default=0)


class Post(SQLModel, table=True):
    id: int = Field(primary_key=True)
    department_id: int = Field(foreign_key='department.id')
    name: str
    is_deleted: bool

    workers: list['Worker'] = Relationship(
        back_populates='posts', link_model=PostWorker)
    post_constraint_posts: list['PostConstraintPost'] = Relationship(
        back_populates='post')

    @property
    def active_workers(self) -> list['Worker']:
        return [worker for worker in self.workers if not worker.is_deleted]


class Worker(SQLModel, table=True):
    id: int = Field(primary_key=True)
    department_id: int = Field(foreign_key="department.id")
    name: str
    is_deleted: bool

    posts: list['Post'] = Relationship(
        back_populates='workers', link_model=PostWorker)
    worker_constraint_workers: list['WorkerConstraintWorker'] = Relationship(
        back_populates='worker')

    @property
    def active_posts(self) -> list['Post']:
        return [post for post in self.posts if not post.is_deleted]


class PostConstraintType(SQLModel, table=True):
    __tablename__ = 'post_constraint_type'
    id: int = Field(primary_key=True)
    name: str
    enum: int

    post_constraints: list['PostConstraint'] = Relationship(
        back_populates='post_constraint_type')


class PostConstraint(SQLModel, table=True):
    __tablename__ = 'post_constraint'
    id: int = Field(primary_key=True)
    department_id: int = Field(foreign_key='department.id')
    post_constraint_type_id: int = Field(foreign_key='post_constraint_type.id')
    weighting: Decimal

    post_constraint_type: PostConstraintType = Relationship(
        back_populates='post_constraints')
    post_constraint_posts: list['PostConstraintPost'] = Relationship(
        back_populates='post_constraint')


class PostConstraintPost(SQLModel, table=True):
    __tablename__ = 'post_constraint_post'
    id: int = Field(primary_key=True)
    post_constraint_id: int = Field(foreign_key='post_constraint.id')
    post_id: int = Field(foreign_key='post.id')

    post_constraint: PostConstraint = Relationship(
        back_populates='post_constraint_posts')
    post: Post = Relationship(back_populates='post_constraint_posts')


class WorkerConstraintType(SQLModel, table=True):
    __tablename__ = 'worker_constraint_type'
    id: int = Field(primary_key=True)
    name: str
    enum: int

    worker_constraints: list['WorkerConstraint'] = Relationship(
        back_populates='worker_constraint_type')


class WorkerConstraint(SQLModel, table=True):
    __tablename__ = 'worker_constraint'
    id: int = Field(primary_key=True)
    department_id: int = Field(foreign_key='department.id')
    worker_constraint_type_id: int = Field(
        foreign_key='worker_constraint_type.id')
    weighting: Decimal

    worker_constraint_type: WorkerConstraintType = Relationship(
        back_populates='worker_constraints')
    worker_constraint_workers: list['WorkerConstraintWorker'] = Relationship(
        back_populates='worker_constraint')


class WorkerConstraintWorker(SQLModel, table=True):
    __tablename__ = 'worker_constraint_worker'
    id: int = Field(primary_key=True)
    worker_constraint_id: int = Field(foreign_key='worker_constraint.id')
    worker_id: int = Field(foreign_key='worker.id')

    worker_constraint: WorkerConstraint = Relationship(
        back_populates='worker_constraint_workers')
    worker: Worker = Relationship(back_populates='worker_constraint_workers')
