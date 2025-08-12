from datetime import datetime
from sqlmodel import select
from models.dao import Worker, Post
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest
from ortools.sat.python import cp_model


class RosterMaterial:
    db_session: DbSession
    request: ArrangeRosterRequest
    posts: list[Post]
    workers: list[Worker]
    model: cp_model.CpModel
    shifts: dict[tuple[datetime, int, int], cp_model.IntVar]

    def __init__(
        self,
        db_session: DbSession,
        request: ArrangeRosterRequest,
    ):
        self.db_session = db_session
        self.request = request
        self.posts = self.__find_posts()
        self.workers = self.__find_workers()
        self.model = cp_model.CpModel()
        self.shifts = self.__create_shifts()

    def __find_posts(self) -> list[Post]:
        return self.db_session.exec(
            select(Post)
            .where(Post.department_id == self.request.department_id)
            .where(Post.is_deleted == False)
        ).all()

    def __find_workers(self) -> list[Worker]:
        return self.db_session.exec(
            select(Worker)
            .where(Worker.department_id == self.request.department_id)
            .where(Worker.is_deleted == False)
        ).all()

    def __create_shifts(self) -> dict[tuple[datetime, int, int], cp_model.IntVar]:
        shifts: dict[tuple[datetime, int, int], cp_model.IntVar] = {}

        for day in self.request.days:
            for post in self.posts:
                for worker in post.active_workers:
                    shifts[(day, post.id, worker.id)] = self.model.new_bool_var(
                        f'shift_{day}_{post.id}_{worker.id}')

        return shifts
