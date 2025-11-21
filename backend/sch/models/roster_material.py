from datetime import datetime
from sqlmodel import select
from models.dao import Department, PostWorker, Worker, Post
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest
from ortools.sat.python import cp_model
from fastapi import HTTPException


class RosterMaterial:
    db_session: DbSession
    request: ArrangeRosterRequest
    department: Department
    posts: list[Post]
    workers: list[Worker]
    post_worker_priorities: dict[tuple[int, int], int]
    model: cp_model.CpModel
    shifts: dict[tuple[datetime, int, int], cp_model.IntVar]

    def __init__(
        self,
        db_session: DbSession,
        request: ArrangeRosterRequest,
    ):
        self.db_session = db_session
        self.request = request
        self.department = self.__find_department()
        self.posts = self.__find_posts()
        self.workers = self.__find_workers()
        self.post_worker_priorities = self.__find_post_worker_priorities()
        self.model = cp_model.CpModel()
        self.shifts = self.__create_shifts()

    def __find_department(self) -> Department:
        department = self.db_session.exec(
            select(Department)
            .where(Department.id == self.request.department_id)
        ).first()

        if department is None:
            raise HTTPException(
                status_code=404,
                detail=f"Department not found. ID={self.request.department_id}"
            )

        return department

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

    def __create_shifts(self) -> dict[tuple[datetime, int, int], cp_model.IntVar]:
        shifts: dict[tuple[datetime, int, int], cp_model.IntVar] = {}

        for day in self.request.days:
            for post in self.posts:
                for worker in post.active_workers:
                    shifts[(day, post.id, worker.id)] = self.model.new_bool_var(
                        f'shift_{day}_{post.id}_{worker.id}')

        return shifts
