"""
Diagnostic tests: why a DB worker_affinity pair may not appear co-scheduled.

Does NOT fix production code — only documents / reproduces the soft-weight
interaction that makes affinity lose to assignment priority and modify
preservation.

Observation under test
----------------------
`__create_workers_correlate_reward` adds +1 objective per timeslot when ALL
affinity members are assigned that timeslot. In `__create_base_objective` that
term is unscaled (weight 1), while `total_assignment_reward` is multiplied by
10 and modify adds `preservation_reward * >=100`. So a queried affinity row
can be real and still have negligible effect on the optimal solution.
"""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any
from unittest.mock import patch

from ortools.sat.python import cp_model

from helpers.roster_model_helper import RosterModelHelper


def _worker(worker_id: int, posts: list[Any]) -> Any:
    w = SimpleNamespace(id=worker_id, posts=posts)
    return w


def _post(post_id: int, workers: list[Any]) -> Any:
    return SimpleNamespace(id=post_id, workers=workers)


def _affinity_pair(affinity_id: int, workers: list[Any]) -> Any:
    """Minimal affinity graph that `__create_workers_correlate_reward` walks."""
    return SimpleNamespace(
        id=affinity_id,
        team_id=1,
        members=[
            SimpleNamespace(worker_id=w.id, worker=w)
            for w in workers
        ],
    )


def _build_material(
    *,
    timeslots: list[str],
    posts: list[Any],
    workers: list[Any],
    priorities: dict[tuple[int, int], int],
    offs: list[Any] | None = None,
    max_worker_assign_per_roster: int | None = None,
) -> Any:
    model = cp_model.CpModel()
    shifts: dict[tuple[str, int, int], cp_model.IntVar] = {}
    for timeslot in timeslots:
        for post in posts:
            for worker in post.workers:
                shifts[(timeslot, post.id, worker.id)] = model.new_bool_var(
                    f"shift_{timeslot}_{post.id}_{worker.id}"
                )

    return SimpleNamespace(
        model=model,
        request=SimpleNamespace(
            team_id=1,
            timeslots=timeslots,
            offs=offs or [],
        ),
        team=SimpleNamespace(max_worker_assign_per_roster=max_worker_assign_per_roster),
        posts=posts,
        workers=workers,
        post_worker_priorities=priorities,
        shifts=shifts,
        db_session=None,
    )


def _assigned_worker_ids_by_timeslot(material: Any, solver: cp_model.CpSolver) -> dict[str, set[int]]:
    out: dict[str, set[int]] = {ts: set() for ts in material.request.timeslots}
    for (timeslot, _post_id, worker_id), var in material.shifts.items():
        if solver.value(var) == 1:
            out[timeslot].add(worker_id)
    return out


def _co_scheduled_timeslots(
    material: Any,
    solver: cp_model.CpSolver,
    worker_a: int,
    worker_b: int,
) -> list[str]:
    by_ts = _assigned_worker_ids_by_timeslot(material, solver)
    return [
        ts
        for ts, workers in by_ts.items()
        if worker_a in workers and worker_b in workers
    ]


# ---------------------------------------------------------------------------
# 1) Pure weight arithmetic (no solver) — documents the scale mismatch
# ---------------------------------------------------------------------------


def test_affinity_bool_weight_is_dwarfed_by_one_assignment_priority_step():
    """One priority step in assignment*10 beats a full week of affinity +1s."""
    timeslots = 7
    max_affinity_reward_for_one_pair = timeslots  # +1 per co-scheduled day
    one_priority_step_assignment_delta = 1 * 10  # from (2+p)*10 vs (2+p-1)*10

    assert one_priority_step_assignment_delta > 1
    assert one_priority_step_assignment_delta * timeslots > max_affinity_reward_for_one_pair


def test_modify_preservation_weight_dwarfs_affinity():
    """Modify path: preservation_weight >= 100; affinity remains weight 1."""
    max_priority = 0
    preservation_weight = max(100, (2 + max_priority) * 10 * 2)
    affinity_weight = 1
    timeslots = 7

    assert preservation_weight >= 100
    assert preservation_weight > affinity_weight * timeslots


# ---------------------------------------------------------------------------
# 2) Solver: affinity pair is loaded, but higher priority wins arrange
# ---------------------------------------------------------------------------


def test_arrange_prefers_high_priority_over_affinity_pair():
    """
    Affinity (W1,W2) is present and feasible, but W3/W4 have higher priority.
    Optimal arrange should fill posts with W3/W4 — pair never co-scheduled.

    Mirrors: DB has worker_affinity rows, query at line ~413 sees them, yet
    result does not put the pair together.
    """
    timeslots = ["d1", "d2"]

    # Wire posts onto workers after both exist (bidirectional eligibility).
    w1 = _worker(1, [])
    w2 = _worker(2, [])
    w3 = _worker(3, [])
    w4 = _worker(4, [])
    p1 = _post(10, [w1, w3])
    p2 = _post(20, [w2, w4])
    w1.posts = [p1]
    w2.posts = [p2]
    w3.posts = [p1]
    w4.posts = [p2]

    material = _build_material(
        timeslots=timeslots,
        posts=[p1, p2],
        workers=[w1, w2, w3, w4],
        priorities={
            (10, 1): 0,
            (10, 3): 5,  # preferred for p1
            (20, 2): 0,
            (20, 4): 5,  # preferred for p2
        },
        max_worker_assign_per_roster=None,
    )

    affinity = _affinity_pair(99, [w1, w2])

    with (
        patch.object(
            RosterModelHelper,
            "_RosterModelHelper__find_worker_affinities",
            return_value=[affinity],
        ),
        patch.object(
            RosterModelHelper,
            "_RosterModelHelper__find_post_affinities",
            return_value=[],
        ),
    ):
        RosterModelHelper.define_constraints(material)
        RosterModelHelper.define_objective(material)

    solver = cp_model.CpSolver()
    status = solver.solve(material.model)
    assert status == cp_model.OPTIMAL

    # High-priority fillers occupy both posts every day.
    by_ts = _assigned_worker_ids_by_timeslot(material, solver)
    for ts in timeslots:
        assert 3 in by_ts[ts]
        assert 4 in by_ts[ts]

    assert _co_scheduled_timeslots(material, solver, 1, 2) == []


def test_arrange_would_co_schedule_pair_if_affinity_were_heavily_weighted():
    """
    Control: same instance as above, but amplify worker_affinity in the
    objective. Then the pair IS co-scheduled — proving the correlate constraints
    work; only the production weight makes affinity lose.
    """
    timeslots = ["d1", "d2"]
    w1 = _worker(1, [])
    w2 = _worker(2, [])
    w3 = _worker(3, [])
    w4 = _worker(4, [])
    p1 = _post(10, [w1, w3])
    p2 = _post(20, [w2, w4])
    w1.posts = [p1]
    w2.posts = [p2]
    w3.posts = [p1]
    w4.posts = [p2]

    material = _build_material(
        timeslots=timeslots,
        posts=[p1, p2],
        workers=[w1, w2, w3, w4],
        priorities={
            (10, 1): 0,
            (10, 3): 5,
            (20, 2): 0,
            (20, 4): 5,
        },
        max_worker_assign_per_roster=None,
    )

    affinity = _affinity_pair(99, [w1, w2])

    with (
        patch.object(
            RosterModelHelper,
            "_RosterModelHelper__find_worker_affinities",
            return_value=[affinity],
        ),
        patch.object(
            RosterModelHelper,
            "_RosterModelHelper__find_post_affinities",
            return_value=[],
        ),
    ):
        RosterModelHelper.define_constraints(material)
        # Production base objective, then add a huge extra affinity term.
        base = RosterModelHelper._RosterModelHelper__create_base_objective(material)
        boosted = RosterModelHelper._RosterModelHelper__create_worker_affinity_reward(
            material
        )
        material.model.maximize(base + boosted * 10_000)

    solver = cp_model.CpSolver()
    status = solver.solve(material.model)
    assert status == cp_model.OPTIMAL

    # With huge affinity weight, W1+W2 occupy both posts (priority loses).
    assert len(_co_scheduled_timeslots(material, solver, 1, 2)) == len(timeslots)


# ---------------------------------------------------------------------------
# 3) Modify: preservation swamps affinity even when pair is preferred by softs
# ---------------------------------------------------------------------------


def test_modify_preservation_keeps_pair_apart_despite_affinity():
    """
    Original roster keeps affinity workers on different days. Affinity wants
    them together, but preservation_weight >= 100 blocks the move.

    Matches the live path: POST /roster/modify (再排).
    """
    from models.roster import RosterPost, RosterPostTimeslot

    timeslots = ["d1", "d2"]
    w1 = _worker(1, [])
    w2 = _worker(2, [])
    w3 = _worker(3, [])
    p1 = _post(10, [w1, w2, w3])
    p2 = _post(20, [w1, w2, w3])
    w1.posts = [p1, p2]
    w2.posts = [p1, p2]
    w3.posts = [p1, p2]

    material = _build_material(
        timeslots=timeslots,
        posts=[p1, p2],
        workers=[w1, w2, w3],
        priorities={
            (10, 1): 0,
            (10, 2): 0,
            (10, 3): 0,
            (20, 1): 0,
            (20, 2): 0,
            (20, 3): 0,
        },
        max_worker_assign_per_roster=None,
    )

    # d1: W1 + W3; d2: W2 + W3 — affinity pair (1,2) never shares a day.
    original_roster = [
        RosterPost(
            postId=10,
            timeslots=[
                RosterPostTimeslot(timeslot="d1", workerId=1),
                RosterPostTimeslot(timeslot="d2", workerId=2),
            ],
        ),
        RosterPost(
            postId=20,
            timeslots=[
                RosterPostTimeslot(timeslot="d1", workerId=3),
                RosterPostTimeslot(timeslot="d2", workerId=3),
            ],
        ),
    ]

    affinity = _affinity_pair(99, [w1, w2])

    with (
        patch.object(
            RosterModelHelper,
            "_RosterModelHelper__find_worker_affinities",
            return_value=[affinity],
        ),
        patch.object(
            RosterModelHelper,
            "_RosterModelHelper__find_post_affinities",
            return_value=[],
        ),
    ):
        RosterModelHelper.define_constraints(material)
        RosterModelHelper.define_modify_objective(material, original_roster)

    solver = cp_model.CpSolver()
    status = solver.solve(material.model)
    assert status == cp_model.OPTIMAL

    assert _co_scheduled_timeslots(material, solver, 1, 2) == []


def test_equal_priority_arrange_can_co_schedule_affinity_pair():
    """
    Sanity: when priorities are equal and no preservation, production weights
    still allow the correlate reward to pull the pair onto the same days.
    If this fails, the bug is deeper than weight scale (e.g. empty posts on
    affinity members).
    """
    timeslots = ["d1", "d2"]
    w1 = _worker(1, [])
    w2 = _worker(2, [])
    w3 = _worker(3, [])
    w4 = _worker(4, [])
    p1 = _post(10, [w1, w3])
    p2 = _post(20, [w2, w4])
    w1.posts = [p1]
    w2.posts = [p2]
    w3.posts = [p1]
    w4.posts = [p2]

    material = _build_material(
        timeslots=timeslots,
        posts=[p1, p2],
        workers=[w1, w2, w3, w4],
        priorities={
            (10, 1): 0,
            (10, 3): 0,
            (20, 2): 0,
            (20, 4): 0,
        },
        max_worker_assign_per_roster=None,
    )

    affinity = _affinity_pair(99, [w1, w2])

    with (
        patch.object(
            RosterModelHelper,
            "_RosterModelHelper__find_worker_affinities",
            return_value=[affinity],
        ),
        patch.object(
            RosterModelHelper,
            "_RosterModelHelper__find_post_affinities",
            return_value=[],
        ),
    ):
        RosterModelHelper.define_constraints(material)
        RosterModelHelper.define_objective(material)

    solver = cp_model.CpSolver()
    status = solver.solve(material.model)
    assert status == cp_model.OPTIMAL

    # Equal priority: affinity can pull the pair together on some days, but
    # balancing / variety (also weight 1) may still keep them apart on others.
    # Full co-schedule every day is NOT guaranteed at production weights.
    co_days = _co_scheduled_timeslots(material, solver, 1, 2)
    assert len(co_days) >= 1
    assert len(co_days) <= len(timeslots)
