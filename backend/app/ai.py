from fastapi import APIRouter
from pydantic import BaseModel

from app.gemini import generate_job_description, optimize_job_description, validate_job_description

router = APIRouter(prefix="/api/ai", tags=["ai"])


class AIRequest(BaseModel):
    title: str
    skills: str
    experience: str


class OptimizeJobRequest(BaseModel):
    description: str
    platform: str


class ValidateJobRequest(BaseModel):
    description: str
    platform: str


@router.post("/generate-job")
def generate_job(data: AIRequest):
    description = generate_job_description(
        data.title,
        data.skills,
        data.experience,
    )

    return {
        "description": description
    }


@router.post("/optimize-job")
def optimize_job(data: OptimizeJobRequest):
    optimized_description = optimize_job_description(
        data.description,
        data.platform,
    )

    return {
        "optimized_description": optimized_description
    }


@router.post("/validate-job")
def validate_job(data: ValidateJobRequest):
    validation_result = validate_job_description(
        data.description,
        data.platform,
    )

    return validation_result


@router.get("/health")
def ai_health_check():
    return {"status": "ok"}