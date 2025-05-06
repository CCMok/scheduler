from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, create_engine
from config.global_config import get_setting


engine = create_engine(
    get_setting().database_url
)


def get_session():
    with Session(engine) as session:
        yield session


DbSession = Annotated[Session, Depends(get_session)]
