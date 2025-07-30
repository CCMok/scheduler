from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Setting(BaseSettings):
    database_url: str
    frontend_web_url: str
    api_key: str

    model_config = SettingsConfigDict(env_file='.env')


@lru_cache
def get_setting() -> Setting:
    return Setting()
