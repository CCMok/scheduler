from sqlmodel import Field, Relationship, SQLModel


class PostWorker(SQLModel, table=True):
    __tablename__ = 'post_worker'
    id: int = Field(primary_key=True)
    post_id: int = Field(foreign_key='post.id')
    worker_id: int = Field(foreign_key='worker.id')


class Post(SQLModel, table=True):
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key='tenant.id')
    name: str
    workers: list['Worker'] = Relationship(back_populates='posts', link_model=PostWorker)


class Worker(SQLModel, table=True):
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key="tenant.id")
    name: str
    posts: list['Post'] = Relationship(back_populates='workers', link_model=PostWorker)


class PostConstraintType(SQLModel, table=True):
    __tablename__ = 'post_constraint_type'
    id: int = Field(primary_key=True)
    name: str
    enum: int

    post_constraints: list['PostConstraint'] = Relationship(back_populates='post_constraint_type')


class PostConstraint(SQLModel, table=True):
    __tablename__ = 'post_constraint'
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key='tenant.id')
    post_constraint_type_id: int = Field(foreign_key='post_constraint_type.id')
    weighting: int

    post_constraint_type: PostConstraintType = Relationship(back_populates='post_constraints')
    post_constraint_posts: list['PostConstraintPost'] = Relationship(back_populates='post_constraint')


class PostConstraintPost(SQLModel, table=True):
    __tablename__ = 'post_constraint_post'
    id: int = Field(primary_key=True)
    post_constraint_id: int = Field(foreign_key='post_constraint.id')
    post_id: int = Field(foreign_key='post.id')

    post_constraint: PostConstraint = Relationship(back_populates='post_constraint_posts')


class WorkerConstraintType(SQLModel, table=True):
    __tablename__ = 'worker_constraint_type'
    id: int = Field(primary_key=True)
    name: str
    enum: int

    worker_constraints: list['WorkerConstraint'] = Relationship(back_populates='worker_constraint_type')


class WorkerConstraint(SQLModel, table=True):
    __tablename__ = 'worker_constraint'
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key='tenant.id')
    worker_constraint_type_id: int = Field(foreign_key='worker_constraint_type.id')
    weighting: int

    worker_constraint_type: WorkerConstraintType = Relationship(back_populates='worker_constraints')
    worker_constraint_workers: list['WorkerConstraintWorker'] = Relationship(back_populates='worker_constraint')


class WorkerConstraintWorker(SQLModel, table=True):
    __tablename__ = 'worker_constraint_worker'
    id: int = Field(primary_key=True)
    worker_constraint_id: int = Field(foreign_key='worker_constraint.id')
    worker_id: int = Field(foreign_key='worker.id')

    worker_constraint: WorkerConstraint = Relationship(back_populates='worker_constraint_workers')
