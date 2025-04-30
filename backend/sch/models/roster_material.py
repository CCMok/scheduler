from models.constraint_setting import PostsConstraintSetting, WorkersConstraintSetting
from models.post import Post
from models.worker import Worker
from ortools.sat.python import cp_model
from enums.constraint_type import PostsConstraintType, WorkersConstraintType


class RosterMaterial:
    days: range
    posts: list[Post]
    workers: list[Worker]
    posts_constraint_settings: list[PostsConstraintSetting]
    workers_constraint_settings: list[WorkersConstraintSetting]
    model: cp_model.CpModel
    shifts: dict[tuple[int, int, int], cp_model.IntVar]

    def __init__(
        self,
        days: range = None,
        posts: list[Post] = None,
        workers: list[Worker] = None,
        posts_constraint_settings: list[PostsConstraintSetting] = None,
        workers_constraint_settings: list[WorkersConstraintSetting] = None,
    ):
        self.days = days if days else RosterMaterialDefault.days()
        self.posts = posts if posts else RosterMaterialDefault.posts()
        self.workers = workers if workers else RosterMaterialDefault.workers()

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
    def posts() -> list[Post]:
        return [
            Post(id=0, name='Host'),
            Post(id=1, name='Worship Leader'),
            Post(id=2, name='Keyboard'),
            Post(id=3, name='Guitar'),
            Post(id=4, name='Drum'),
            Post(id=5, name='Bass'),
            Post(id=6, name='Vocal Women'),
            Post(id=7, name='Vocal Men'),
            Post(id=8, name='Audio'),
            Post(id=9, name='Powerpoint'),
        ]

    @staticmethod
    def workers() -> list[Worker]:
        return [
            Worker(id=0, name='Jane', post_ids=[0]),
            Worker(id=1, name='Alan', post_ids=[1]),
            Worker(id=2, name='QQ', post_ids=[2]),
            Worker(id=3, name='Gogo', post_ids=[3]),
            Worker(id=4, name='Jeffery', post_ids=[4]),
            Worker(id=5, name='Shu Yan', post_ids=[6]),
            Worker(id=6, name='Vincent', post_ids=[7]),
            Worker(id=7, name='Marco', post_ids=[8]),
            Worker(id=8, name='YL', post_ids=[9]),
            Worker(id=9, name='Foon', post_ids=[0]),
            Worker(id=10, name='Chow Sir', post_ids=[0, 1, 8]),
            Worker(id=11, name='Sunny', post_ids=[4]),
            Worker(id=12, name='Pakho', post_ids=[7]),
            Worker(id=13, name='Andrea', post_ids=[9]),
            Worker(id=14, name='Jason', post_ids=[1, 7]),
            Worker(id=15, name='Kathryn', post_ids=[6]),
            Worker(id=16, name='Simmon', post_ids=[0]),
            Worker(id=17, name='Florence', post_ids=[1]),
            Worker(id=18, name='Amy', post_ids=[6]),
            Worker(id=19, name='Kwok Fai', post_ids=[0]),
            Worker(id=20, name='Betty', post_ids=[1]),
            Worker(id=21, name='Picnic', post_ids=[8]),
            Worker(id=22, name='Ka yan', post_ids=[9]),
            Worker(id=23, name='Louis', post_ids=[8]),
        ]

    @staticmethod
    def posts_constraint_settings() -> list[PostsConstraintSetting]:
        return [
            PostsConstraintSetting(
                id=0,
                constraint_type=PostsConstraintType.AT_LEAST_1_WORKER_PER_DAY,
                weighting=1,
                post_ids=[2, 3],
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
