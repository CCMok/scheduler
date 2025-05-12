from sqlmodel import select
from models.dao import Worker, Post
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest
from ortools.sat.python import cp_model


class RosterMaterial:
    db_session: DbSession
    request: ArrangeRosterRequest
    days: range
    posts: list[Post]
    workers: list[Worker]
    model: cp_model.CpModel
    shifts: dict[tuple[int, int, int], cp_model.IntVar]

    def __init__(
        self,
        db_session: DbSession,
        request: ArrangeRosterRequest,
    ):
        self.db_session = db_session
        self.request = request
        self.days = range(request.day_count)
        self.posts = self.__find_post(db_session, request.tenant_id)
        self.workers = self.__find_worker(db_session, request.tenant_id)
        self.model = cp_model.CpModel()
        self.shifts = self.__create_shifts()

    def __find_post(self, db_session: DbSession, tenant_id: int) -> list[Post]:
        return db_session.exec(
            select(Post).where(Post.tenant_id == tenant_id)
        ).all()

    def __find_worker(self, db_session: DbSession, tenant_id: int):
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
