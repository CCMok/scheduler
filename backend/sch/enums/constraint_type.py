from enum import StrEnum


class PostsConstraintType(StrEnum):
    AT_LEAST_1_WORKER_PER_DAY = 'AT_LEAST_1_WORKER_PER_DAY'


class WorkersConstraintType(StrEnum):
    CORRELATE = 'CORRELATE'
