from models.post import Post
from models.worker import Worker


class RosterMaterial():
    # param consist range type, use normal class instead of pydatic model
    def __init__(self, weeks: range, posts: list[Post], workers: list[Worker]):
        self.weeks = weeks
        self.posts = posts
        self.workers = workers
