from fastapi import Header, HTTPException
from config.global_config import get_setting
from enums.header_key import HeaderKey


def verify_api_key(x_api_key: str = Header(alias=HeaderKey.X_API_KEY.value)):
    if x_api_key != get_setting().api_key:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key
