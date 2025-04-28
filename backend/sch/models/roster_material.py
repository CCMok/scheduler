from models.posts_constraint_setting import PostsConstraintSetting
from models.post import Post
from models.worker import Worker


class RosterMaterial():
    # param consist range type, use normal class instead of pydatic model
    def __init__(
        self,
        days: range,
        posts: list[Post],
        workers: list[Worker],
        posts_constraint_settings: list[PostsConstraintSetting]
    ):
        self.days = days
        self.posts = posts
        self.workers = workers
        self.posts_constraint_settings = posts_constraint_settings
