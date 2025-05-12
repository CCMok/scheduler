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

    constraint_settings: list['PostConstraintSetting'] = Relationship(back_populates='constraint_type')


class PostConstraintSetting(SQLModel, table=True):
    __tablename__ = 'post_constraint_setting'
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key='tenant.id')
    constraint_type_id: int = Field(foreign_key='post_constraint_type.id')
    weighting: int

    setting_posts: list['PostConstraintSettingPost'] = Relationship(back_populates='constraint_setting')
    constraint_type: PostConstraintType = Relationship(back_populates='constraint_settings')


class PostConstraintSettingPost(SQLModel, table=True):
    __tablename__ = 'post_constraint_setting_post'
    id: int = Field(primary_key=True)
    constraint_setting_id: int = Field(foreign_key='post_constraint_setting.id')
    post_id: int = Field(foreign_key='post.id')

    constraint_setting: PostConstraintSetting = Relationship(back_populates='setting_posts')


class WorkerConstraintType(SQLModel, table=True):
    __tablename__ = 'worker_constraint_type'
    id: int = Field(primary_key=True)
    name: str
    enum: int

    constraint_settings: list['WorkerConstraintSetting'] = Relationship(back_populates='constraint_type')


class WorkerConstraintSetting(SQLModel, table=True):
    __tablename__ = 'worker_constraint_setting'
    id: int = Field(primary_key=True)
    tenant_id: int = Field(foreign_key='tenant.id')
    constraint_type_id: int = Field(foreign_key='worker_constraint_type.id')
    weighting: int

    setting_workers: list['WorkerConstraintSettingWorker'] = Relationship(back_populates='constraint_setting')
    constraint_type: WorkerConstraintType = Relationship(back_populates='constraint_settings')


class WorkerConstraintSettingWorker(SQLModel, table=True):
    __tablename__ = 'worker_constraint_setting_worker'
    id: int = Field(primary_key=True)
    constraint_setting_id: int = Field(foreign_key='worker_constraint_setting.id')
    worker_id: int = Field(foreign_key='worker.id')

    constraint_setting: WorkerConstraintSetting = Relationship(back_populates='setting_workers')
