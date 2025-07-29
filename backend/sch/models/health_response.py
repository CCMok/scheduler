from pydantic import BaseModel, ConfigDict, Field


class HealthResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)  # Allow nullable field with alias

    is_healthy: bool = Field(alias="isHealthy")
