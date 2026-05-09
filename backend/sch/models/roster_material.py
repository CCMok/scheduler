from sqlmodel import select
from enums.worker_status import WorkerStatus
from models.dao import Team, PostWorker, Worker, Post
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest
from ortools.sat.python import cp_model
from fastapi import HTTPException


class RosterMaterial:
    db_session: DbSession
    request: ArrangeRosterRequest
    team: Team
    posts: list[Post]
    workers: list[Worker]
    post_worker_priorities: dict[tuple[int, int], int]
    model: cp_model.CpModel
    shifts: dict[tuple[str, int, int], cp_model.IntVar]

    def __init__(
        self,
        db_session: DbSession,
        request: ArrangeRosterRequest,
    ):
        self.db_session = db_session
        self.request = request
        self.team = self.__find_team()
        self.posts = self.__find_posts()
        self.workers = self.__find_workers()
        self.post_worker_priorities = self.__find_post_worker_priorities()
        self.model = cp_model.CpModel()
        self.shifts = self.__create_shifts()

    def __find_team(self) -> Team:
        team = self.db_session.exec(
            select(Team)
            .where(Team.id == self.request.team_id)
        ).first()

        if team is None:
            raise HTTPException(
                status_code=404,
                detail=f"Team not found. ID={self.request.team_id}"
            )

        return team

    def __find_posts(self) -> list[Post]:
        return self.db_session.exec(
            select(Post)
            .where(Post.team_id == self.request.team_id)
        ).all()

    def __find_workers(self) -> list[Worker]:
        return self.db_session.exec(
            select(Worker)
            .where(Worker.team_id == self.request.team_id, Worker.status == WorkerStatus.ACTIVE.value)
        ).all()

    # Run after post fetching
    def __find_post_worker_priorities(self) -> dict[tuple[int, int], int]:
        post_ids = [post.id for post in self.posts]

        post_workers = self.db_session.exec(
            select(PostWorker)
            .where(PostWorker.post_id.in_(post_ids))
        ).all()

        return {
            (post_worker.post_id, post_worker.worker_id): post_worker.priority
            for post_worker in post_workers
        }

    def __create_shifts(self) -> dict[tuple[str, int, int], cp_model.IntVar]:
        shifts: dict[tuple[str, int, int], cp_model.IntVar] = {}

        for timeslot in self.request.timeslots:
            for post in self.posts:
                for worker in post.workers:
                    shifts[(timeslot, post.id, worker.id)] = self.model.new_bool_var(
                        f'shift_{timeslot}_{post.id}_{worker.id}')

        return shifts
