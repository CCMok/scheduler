from typing import Dict
from pydantic import BaseModel


class Schedule(BaseModel):
    day: int
    arrangement: Dict[int, int]
