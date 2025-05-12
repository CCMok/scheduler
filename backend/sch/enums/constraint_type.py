from enum import StrEnum, Enum


class PostsConstraintType(Enum):
    AT_LEAST_1_WORKER_PER_DAY = 0


class WorkersConstraintType(StrEnum):
    CORRELATE = 'CORRELATE'
