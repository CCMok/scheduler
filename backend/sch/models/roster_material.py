from sqlmodel import select
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest, OffRequest
from models.constraint_setting import PostsConstraintSetting, WorkersConstraintSetting
from models.post import Post
from models.worker import Worker
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
        workers: list[Worker] = None,
        posts_constraint_settings: list[PostsConstraintSetting] = None,
        workers_constraint_settings: list[WorkersConstraintSetting] = None,
    ):
        self.days = range(request.day_count)
        self.posts = self.find_post(db_session, request.tenant_id)
        self.workers = workers if workers else RosterMaterialDefault.workers()
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

    def __create_shifts(self) -> dict[tuple[int, int, int], cp_model.IntVar]:
        shifts: dict[tuple[int, int, int], cp_model.IntVar] = {}

        for day in self.days:
            for worker in self.workers:
                for post_id in worker.post_ids:
                    shifts[(day, post_id, worker.id)] = self.model.new_bool_var(
                        f'shift_{day}_{post_id}_{worker.id}'
                    )

        return shifts


class RosterMaterialDefault:
    @staticmethod
    def days() -> range:
        return range(4)

    @staticmethod
    def workers() -> list[Worker]:
        return [
            Worker(id=0, name='Jane', post_ids=[2]),
            Worker(id=1, name='Alan', post_ids=[3]),
            Worker(id=2, name='QQ', post_ids=[4]),
            Worker(id=3, name='Gogo', post_ids=[5]),
            Worker(id=4, name='Jeffery', post_ids=[6]),
            Worker(id=5, name='Shu Yan', post_ids=[8]),
            Worker(id=6, name='Vincent', post_ids=[9]),
            Worker(id=7, name='Marco', post_ids=[10]),
            Worker(id=8, name='YL', post_ids=[11]),
            Worker(id=9, name='Foon', post_ids=[2]),
            Worker(id=10, name='Chow Sir', post_ids=[2, 3, 10]),
            Worker(id=11, name='Sunny', post_ids=[6]),
            Worker(id=12, name='Pakho', post_ids=[9]),
            Worker(id=13, name='Andrea', post_ids=[11]),
            Worker(id=14, name='Jason', post_ids=[3, 9]),
            Worker(id=15, name='Kathryn', post_ids=[8]),
            Worker(id=16, name='Simmon', post_ids=[2]),
            Worker(id=17, name='Florence', post_ids=[3]),
            Worker(id=18, name='Amy', post_ids=[8]),
            Worker(id=19, name='Kwok Fai', post_ids=[2]),
            Worker(id=20, name='Betty', post_ids=[3]),
            Worker(id=21, name='Picnic', post_ids=[10]),
            Worker(id=22, name='Ka yan', post_ids=[11]),
            Worker(id=23, name='Louis', post_ids=[10]),
        ]

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
    def workers_constraint_settings() -> list[Worker]:
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
