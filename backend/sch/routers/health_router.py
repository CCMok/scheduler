from fastapi import APIRouter
from models.health_response import HealthResponse

router = APIRouter(
    prefix='/health',
    tags=['health'],
)


@router.get('')
async def health_check() -> HealthResponse:
    return HealthResponse(is_healthy=True)
