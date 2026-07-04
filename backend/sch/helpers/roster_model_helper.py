from sqlmodel import select
from models.dao import PostAffinity, Worker, WorkerAffinity
from managers.db import DbSession
from models.roster import RosterPost
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


class RosterModelHelper:
    @staticmethod
    def define_constraints(material: RosterMaterial) -> None:
        RosterModelHelper.__define_each_post_max_worker(material)
        RosterModelHelper.__define_each_worker_max_post_per_timeslot(material)
        RosterModelHelper.__define_each_worker_max_assign_per_roster(material)
        RosterModelHelper.__define_off_constraint(material)

    @staticmethod
    def __define_each_post_max_worker(material: RosterMaterial) -> None:
        for timeslot in material.request.timeslots:
            for post in material.posts:
                material.model.add_at_most_one(
                    material.shifts[(timeslot, post.id, worker.id)]
                    for worker in post.workers
                )

    @staticmethod
    def __define_each_worker_max_post_per_timeslot(material: RosterMaterial) -> None:
        for timeslot in material.request.timeslots:
            for worker in material.workers:
                material.model.add_at_most_one(
                    material.shifts[(timeslot, post.id, worker.id)]
                    for post in worker.posts
                )

    @staticmethod
    def __define_each_worker_max_assign_per_roster(material: RosterMaterial) -> None:
        max_worker_assign_per_roster = material.team.max_worker_assign_per_roster if material.team.max_worker_assign_per_roster is not None else 2

        for worker in material.workers:
            material.model.add(
                sum(
                    material.shifts[(timeslot, post.id, worker.id)]
                    for timeslot in material.request.timeslots
                    for post in worker.posts
                ) <= max_worker_assign_per_roster
            )

    @staticmethod
    def __define_off_constraint(material: RosterMaterial) -> None:
        for off in material.request.offs:
            worker = next((
                worker
                for worker in material.workers
                if worker.id == off.worker_id
            ), None)

            if worker is None:
                continue

            for timeslot in off.timeslots:
                if timeslot not in material.request.timeslots:
                    continue

                for post in worker.posts:
                    material.model.add(
                        material.shifts[(timeslot, post.id,
                                         off.worker_id)] == 0
                    )

    @staticmethod
    def define_objective(material: RosterMaterial) -> None:
        material.model.maximize(
            RosterModelHelper.__create_base_objective(material)
        )

    @staticmethod
    def define_modify_objective(
        material: RosterMaterial,
        original_roster: list[RosterPost],
    ) -> None:
        # Heavily weighted so keeping the original arrangement dominates all
        # other rewards; only the (hard) off constraints force changes.
        preservation_reward = RosterModelHelper.__create_original_roster_preservation_reward(
            material, original_roster
        )

        # Weight must exceed the largest possible per-assignment reward
        # ((2 + priority) * 10) so preservation always wins over reassigning
        # or filling an originally-empty slot.
        max_priority = max(
            material.post_worker_priorities.values(), default=0)
        preservation_weight = max(100, (2 + max_priority) * 10 * 2)

        material.model.maximize(
            RosterModelHelper.__create_base_objective(material)
            + preservation_reward * preservation_weight
        )

    @staticmethod
    def __create_base_objective(material: RosterMaterial) -> cp_model.LinearExpr:
        total_assignment_reward = RosterModelHelper.__create_total_assignment_reward(
            material
        )

        post_affinity_reward = RosterModelHelper.__create_post_affinity_reward(
            material
        )

        worker_affinity_reward = RosterModelHelper.__create_worker_affinity_reward(
            material
        )

        worker_variety_reward = RosterModelHelper.__create_worker_post_variety_reward(
            material
        )

        worker_balancing_penalty = RosterModelHelper.__create_worker_balancing_per_post_penalty(
            material
        )

        # Total assignment is weighted heavily so that maximizing coverage
        # (filling every timeslot) always dominates the balancing penalty and
        # the other soft rewards. Evenness is then optimized among the
        # maximum-coverage solutions.
        return (
            total_assignment_reward * 10
            + post_affinity_reward
            + worker_affinity_reward
            + worker_variety_reward
            - worker_balancing_penalty
        )

    @staticmethod
    def __create_original_roster_preservation_reward(
        material: RosterMaterial,
        original_roster: list[RosterPost],
    ) -> cp_model.LinearExpr:
        """
        Rewards keeping the same worker on the same post and timeslot as the
        original roster. Timeslots that were unassigned (worker_id is None) in
        the original roster are also rewarded for staying unassigned, so the
        solver only changes what it must. Assignments that conflict with the
        updated off requests are excluded by the hard off constraints.
        """
        rewards: list[cp_model.IntVar] = []

        posts_by_id = {post.id: post for post in material.posts}

        for roster_post in original_roster:
            post = posts_by_id.get(roster_post.post_id)

            for roster_timeslot in roster_post.timeslots:
                if roster_timeslot.worker_id is None:
                    if post is None or roster_timeslot.timeslot not in material.request.timeslots:
                        continue

                    slot_shifts = [
                        material.shifts[(
                            roster_timeslot.timeslot, post.id, worker.id)]
                        for worker in post.workers
                        if (roster_timeslot.timeslot, post.id, worker.id) in material.shifts
                    ]

                    slot_empty = material.model.new_bool_var(
                        f'preserve_empty_{roster_timeslot.timeslot}_{post.id}'
                    )

                    material.model.add(
                        sum(slot_shifts) == 0
                    ).only_enforce_if(slot_empty)
                    material.model.add(
                        sum(slot_shifts) >= 1
                    ).only_enforce_if(slot_empty.Not())

                    rewards.append(slot_empty)
                    continue

                key = (
                    roster_timeslot.timeslot,
                    roster_post.post_id,
                    roster_timeslot.worker_id,
                )

                if key not in material.shifts:
                    continue

                rewards.append(material.shifts[key])

        return sum(rewards)

    @staticmethod
    def __create_total_assignment_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        # Integer coefficients only (CP-SAT requirement): base weight of 2 per
        # assignment plus the post-worker priority (same 2:1 ratio as the
        # previous 1 + priority * 0.5 weighting).
        return sum(
            material.shifts[(timeslot, post.id, worker.id)] * (
                2 + material.post_worker_priorities.get(
                    (post.id, worker.id),
                    0  # default priority
                )
            )
            for timeslot in material.request.timeslots
            for post in material.posts
            for worker in post.workers
        )

    @staticmethod
    def __create_worker_post_variety_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        """
        Rewards workers being assigned to different posts across timeslots.
        Higher score when a worker works multiple different posts rather than same post repeatedly.

        Example:
        - Worker A: Post1(timeslot1), Post2(timeslot2), Post3(timeslot3) = 3 unique posts = reward of 3
        - Worker B: Post1(timeslot1), Post1(timeslot2), Post1(timeslot3) = 1 unique post = reward of 1
        """
        rewards: list[cp_model.LinearExpr] = []

        for worker in material.workers:
            if len(worker.posts) <= 1:
                # No variety possible with 0 or 1 posts
                continue

            # For each post, create a boolean indicating if worker is assigned to it at least once
            for post in worker.posts:
                post_assigned_to_worker = material.model.new_bool_var(
                    f'worker_{worker.id}_assigned_to_post_{post.id}'
                )
                rewards.append(post_assigned_to_worker)

                # True if worker works this post on at least one timeslot
                material.model.add(
                    sum(
                        material.shifts[(timeslot, post.id, worker.id)]
                        for timeslot in material.request.timeslots
                    ) >= 1
                ).only_enforce_if(post_assigned_to_worker)

                # False if worker never works this post
                material.model.add(
                    sum(
                        material.shifts[(timeslot, post.id, worker.id)]
                        for timeslot in material.request.timeslots
                    ) == 0
                ).only_enforce_if(post_assigned_to_worker.Not())

        return sum(rewards)

    @staticmethod
    def __create_worker_balancing_per_post_penalty(material: RosterMaterial) -> cp_model.LinearExpr:
        # Determine which workers are available for at least one timeslot
        available_workers_per_post: dict[int, list[Worker]] = {}
        for post in material.posts:
            available_workers: list[Worker] = []
            for worker in post.workers:
                # Check if worker is available for at least one timeslot
                is_available_any_timeslot = False
                for timeslot in material.request.timeslots:
                    # Check if this shift exists (worker is not completely off)
                    is_off_this_timeslot = False
                    for off in material.request.offs:
                        if off.worker_id == worker.id and timeslot in off.timeslots:
                            is_off_this_timeslot = True
                            break

                    if not is_off_this_timeslot:
                        is_available_any_timeslot = True
                        break

                if is_available_any_timeslot:
                    available_workers.append(worker)

            available_workers_per_post[post.id] = available_workers

        post_worker_assignment = {
            post.id: {
                worker.id: sum(
                    material.shifts[(timeslot, post.id, worker.id)]
                    for timeslot in material.request.timeslots
                )
                # Only available workers
                for worker in available_workers_per_post[post.id]
            }
            for post in material.posts
        }

        post_min_assignment = {
            post.id: material.model.new_int_var(
                0, len(material.request.timeslots), f'min_assignment_{post.id}'
            )
            for post in material.posts
        }

        post_max_assignment = {
            post.id: material.model.new_int_var(
                0, len(material.request.timeslots), f'max_assignment_{post.id}'
            )
            for post in material.posts
        }

        for post_id, worker_assignments in post_worker_assignment.items():
            if len(worker_assignments) == 0:  # No available workers
                continue

            for total_assignment in worker_assignments.values():
                material.model.add(total_assignment >=
                                   post_min_assignment[post_id])
                material.model.add(total_assignment <=
                                   post_max_assignment[post_id])

        return sum(
            post_max_assignment[post.id] - post_min_assignment[post.id]
            for post in material.posts
            # Only penalize posts with available workers
            if len(post_worker_assignment[post.id]) > 0
        )

    @staticmethod
    def __create_post_affinity_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        """
        Reward when at least 1 post from the affinity group has a worker assigned each timeslot.
        """
        rewards: list[cp_model.LinearExpr] = []

        post_affinities = RosterModelHelper.__find_post_affinities(
            material.db_session, material.request.team_id
        )

        for post_affinity in post_affinities:
            rewards.append(
                RosterModelHelper.__create_posts_at_least_1_worker_per_timeslot_reward(
                    material, post_affinity
                )
            )

        return sum(rewards)

    @staticmethod
    def __find_post_affinities(db_session: DbSession, team_id: int):
        return db_session.exec(
            select(PostAffinity)
            .where(PostAffinity.team_id == team_id)
        ).all()

    @staticmethod
    def __create_posts_at_least_1_worker_per_timeslot_reward(
        material: RosterMaterial,
        post_affinity: PostAffinity,
    ) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        for timeslot in material.request.timeslots:
            reward = material.model.new_bool_var(
                f'reward_posts_at_least_1_worker_per_timeslot_{post_affinity.id}_{timeslot}'
            )
            rewards.append(reward)

            material.model.add(
                sum(
                    material.shifts[(timeslot, member.post_id, worker.id)]
                    for member in post_affinity.members
                    for worker in member.post.workers
                    if (timeslot, member.post_id, worker.id) in material.shifts
                ) >= 1
            ).only_enforce_if(reward)

            material.model.add(
                sum(
                    material.shifts[(timeslot, member.post_id, worker.id)]
                    for member in post_affinity.members
                    for worker in member.post.workers
                    if (timeslot, member.post_id, worker.id) in material.shifts
                ) < 1
            ).only_enforce_if(reward.Not())

        return sum(rewards)

    @staticmethod
    def __create_worker_affinity_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        """
        Reward when all workers in the affinity group are assigned together on the same timeslot.
        """
        rewards: list[cp_model.LinearExpr] = []

        worker_affinities = RosterModelHelper.__find_worker_affinities(
            material.db_session, material.request.team_id
        )

        for worker_affinity in worker_affinities:
            rewards.append(
                RosterModelHelper.__create_workers_correlate_reward(
                    material, worker_affinity
                )
            )

        return sum(rewards)

    @staticmethod
    def __find_worker_affinities(db_session: DbSession, team_id: int):
        return db_session.exec(
            select(WorkerAffinity)
            .where(WorkerAffinity.team_id == team_id)
        ).all()

    @staticmethod
    def __create_workers_correlate_reward(
            material: RosterMaterial, worker_affinity: WorkerAffinity
    ) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        for timeslot in material.request.timeslots:
            reward = material.model.new_bool_var(
                f'reward_workers_correlate_{worker_affinity.id}_{timeslot}')
            rewards.append(reward)

            worker_assigneds: list[cp_model.IntVar] = []

            for member in worker_affinity.members:
                worker_assigned = material.model.new_bool_var(
                    f'reward_workers_correlate_{worker_affinity.id}_{timeslot}_worker_assigned_'
                    f'{member.worker.id}'
                )
                worker_assigneds.append(worker_assigned)

                material.model.add(
                    sum(
                        material.shifts[(timeslot, post.id, member.worker.id)]
                        for post in member.worker.posts
                        if (timeslot, post.id, member.worker.id) in material.shifts
                    ) >= 1
                ).only_enforce_if(worker_assigned)

                material.model.add(
                    sum(
                        material.shifts[(timeslot, post.id, member.worker.id)]
                        for post in member.worker.posts
                        if (timeslot, post.id, member.worker.id) in material.shifts
                    ) < 1
                ).only_enforce_if(worker_assigned.Not())

            material.model.add_bool_and(
                worker_assigneds).only_enforce_if(reward)
            material.model.add_bool_or([
                worker_assigned.Not()
                for worker_assigned in worker_assigneds
            ]).only_enforce_if(reward.Not())

        return sum(rewards)
