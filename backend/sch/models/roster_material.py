from sqlmodel import select
from models.dao import Worker, Post
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest, OffRequest
from models.constraint_setting import PostsConstraintSetting, WorkersConstraintSetting
from ortools.sat.python import cp_model
from enums.constraint_type import PostsConstraintType, WorkersConstraintType


class RosterMaterial:
    days: range
    posts: list[Post]
    workers: list[Worker]
    offs: list[OffRequest]
    posts_constraint_settings: list[PostsConstraintSetting]
    workers_constraint_settings: list[WorkersConstraintSetting]
    model: cp_model.CpModel
    shifts: dict[tuple[int, int, int], cp_model.IntVar]

    def __init__(
        self,
        request: ArrangeRosterRequest,
        db_session: DbSession,
        posts_constraint_settings: list[PostsConstraintSetting] = None,
        workers_constraint_settings: list[WorkersConstraintSetting] = None,
    ):
        self.days = range(request.day_count)
        self.posts = self.find_post(db_session, request.tenant_id)
        self.workers = self.find_worker(db_session, request.tenant_id)
        self.offs = request.offs

        if posts_constraint_settings:
            self.posts_constraint_settings = posts_constraint_settings
        else:
            self.posts_constraint_settings = RosterMaterialDefault.posts_constraint_settings()

        if workers_constraint_settings:
            self.workers_constraint_settings = workers_constraint_settings
        else:
            self.workers_constraint_settings = RosterMaterialDefault.workers_constraint_settings()

        self.model = cp_model.CpModel()
        self.shifts = self.__create_shifts()

    def find_post(self, db_session: DbSession, tenant_id: int) -> list[Post]:
        return db_session.exec(
            select(Post).where(Post.tenant_id == tenant_id)
        ).all()

    def find_worker(self, db_session: DbSession, tenant_id: int):
        return db_session.exec(
            select(Worker)
            .where(Worker.tenant_id == tenant_id)
        ).all()

    def __create_shifts(self) -> dict[tuple[int, int, int], cp_model.IntVar]:
        shifts: dict[tuple[int, int, int], cp_model.IntVar] = {}

        for day in self.days:
            for worker in self.workers:
                for post in worker.posts:
                    shifts[(day, post.id, worker.id)] = self.model.new_bool_var(
                        f'shift_{day}_{post.id}_{worker.id}'
                    )

        return shifts


class RosterMaterialDefault:
    @staticmethod
    def posts_constraint_settings() -> list[PostsConstraintSetting]:
        return [
            PostsConstraintSetting(
                id=0,
                constraint_type=PostsConstraintType.AT_LEAST_1_WORKER_PER_DAY,
                weighting=1,
                post_ids=[4, 5],
            ),
        ]

    @staticmethod
    def workers_constraint_settings() -> list[WorkersConstraintSetting]:
        return [
            WorkersConstraintSetting(
                id=0,
                constraint_type=WorkersConstraintType.CORRELATE,
                weighting=1,
                worker_ids=[14, 15],
            ),
            WorkersConstraintSetting(
                id=1,
                constraint_type=WorkersConstraintType.CORRELATE,
                weighting=1,
                worker_ids=[16, 17],
            ),
            WorkersConstraintSetting(
                id=2,
                constraint_type=WorkersConstraintType.CORRELATE,
                weighting=1,
                worker_ids=[22, 23],
            ),
        ]
