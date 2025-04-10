from typing import Dict
from pydantic import BaseModel


class Schedule(BaseModel):
    week: int
    arrangement: Dict[str, str]
