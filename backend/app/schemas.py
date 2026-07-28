from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class JobBase(BaseModel):
    title: str
    company: str
    location: str
    description: str
    skills: str
    experience: str


class JobCreate(JobBase):
    pass


class JobOut(JobBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JobOptimizationRequest(BaseModel):
    description: str
    platform: str


class JobOptimizationResponse(BaseModel):
    optimized_description: str


class JobValidationRequest(BaseModel):
    description: str
    platform: str


class JobValidationResponse(BaseModel):
    score: int
    strengths: list[str]
    missing: list[str]
    recommendations: list[str]
