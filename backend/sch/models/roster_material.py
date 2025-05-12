from sqlmodel import select
from models.dao import Worker, Post
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest, OffRequest
from ortools.sat.python import cp_model


class RosterMaterial:
    tenant_id: int
    days: range
    posts: list[Post]
    workers: list[Worker]
    offs: list[OffRequest]
    model: cp_model.CpModel
    shifts: dict[tuple[int, int, int], cp_model.IntVar]

    def __init__(
        self,
        request: ArrangeRosterRequest,
        db_session: DbSession,
    ):
        self.tenant_id = request.tenant_id
        self.days = range(request.day_count)
        self.posts = self.find_post(db_session, request.tenant_id)
        self.workers = self.find_worker(db_session, request.tenant_id)
        self.offs = request.offs
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
