from enums.constraint_type import ConstraintType
from models.posts_constraint_setting import PostsConstraintSetting
from models.worker import Worker
from models.post import Post
from models.roster_material import RosterMaterial


def get_material() -> RosterMaterial:
    return RosterMaterial(
        days=get_days(),
        posts=get_posts(),
        workers=get_workers(),
        posts_constraint_settings=get_posts_constraint_settings(),
    )


def get_days() -> range:
    return range(4)


def get_posts() -> list[Post]:
    return [
        Post(
            id=0,
            name='Host',
        ),
        Post(
            id=1,
            name='Worship Leader',
        ),
        Post(
            id=2,
            name='Keyboard',
        ),
        Post(
            id=3,
            name='Guitar',
        ),
        Post(
            id=4,
            name='Drum',
        ),
        Post(
            id=5,
            name='Bass',
        ),
        Post(
            id=6,
            name='Vocal Women',
        ),
        Post(
            id=7,
            name='Vocal Men',
        ),
        Post(
            id=8,
            name='Audio',
        ),
        Post(
            id=9,
            name='Powerpoint',
        ),
    ]


def get_workers() -> list[Worker]:
    return [
        Worker(
            id=0,
            name='Jane',
            post_ids=[0],
        ),
        Worker(
            id=1,
            name='Alan',
            post_ids=[1],
        ),
        Worker(
            id=2,
            name='QQ',
            post_ids=[2],
        ),
        Worker(
            id=3,
            name='Gogo',
            post_ids=[3],
        ),
        Worker(
            id=4,
            name='Jeffery',
            post_ids=[4],
        ),
        Worker(
            id=5,
            name='Shu Yan',
            post_ids=[6],
        ),
        Worker(
            id=6,
            name='Vincent',
            post_ids=[7],
        ),
        Worker(
            id=7,
            name='Marco',
            post_ids=[8],
        ),
        Worker(
            id=8,
            name='YL',
            post_ids=[9],
        ),
        Worker(
            id=9,
            name='Foon',
            post_ids=[0],
        ),
        Worker(
            id=10,
            name='Chow Sir',
            post_ids=[0, 1, 8],
        ),
        Worker(
            id=11,
            name='Sunny',
            post_ids=[4],
        ),
        Worker(
            id=12,
            name='Pakho',
            post_ids=[7],
        ),
        Worker(
            id=13,
            name='Andrea',
            post_ids=[9],
        ),
        Worker(
            id=14,
            name='Jason',
            post_ids=[1, 7],
        ),
        Worker(
            id=15,
            name='Kathryn',
            post_ids=[6],
        ),
        Worker(
            id=16,
            name='Simmon',
            post_ids=[0],
        ),
        Worker(
            id=17,
            name='Florence',
            post_ids=[1],
        ),
        Worker(
            id=18,
            name='Amy',
            post_ids=[6],
        ),
        Worker(
            id=19,
            name='Kwok Fai',
            post_ids=[0],
        ),
        Worker(
            id=20,
            name='Betty',
            post_ids=[1],
        ),
        Worker(
            id=21,
            name='Picnic',
            post_ids=[8],
        ),
        Worker(
            id=22,
            name='Ka yan',
            post_ids=[9],
        ),
        Worker(
            id=23,
            name='Louis',
            post_ids=[8],
        ),
    ]


def get_posts_constraint_settings() -> list:
    return [
        PostsConstraintSetting(
            id=0,
            constraint_type=ConstraintType.AT_LEAST_1_WORKER_PER_DAY,
            post_ids=[2, 3],
        ),
    ]
