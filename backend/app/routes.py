from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import auth
from app.database import get_db
from app.models import Job, User
from app.schemas import (
    JobCreate,
    JobOut,
    Token,
    UserCreate,
    UserLogin,
    UserOut,
)

# ---------------- AUTH ROUTES ---------------- #

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/auth/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter(
            (User.username == user.username)
            | (User.email == user.email)
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists",
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=auth.get_password_hash(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/auth/login", response_model=Token)
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = auth.authenticate_user(
        db,
        user_credentials.username,
        user_credentials.password,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
        )

    access_token = auth.create_access_token(
        data={"sub": user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/auth/me", response_model=UserOut)
def get_current_user_profile(
    current_user: User = Depends(auth.get_current_user),
):
    return current_user


# ---------------- JOB ROUTES ---------------- #

job_router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@job_router.get("", response_model=list[JobOut])
def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return (
        db.query(Job)
        .filter(Job.owner_id == current_user.id)
        .order_by(Job.created_at.desc())
        .all()
    )


@job_router.post("", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    new_job = Job(
        **job.model_dump(),
        owner_id=current_user.id,
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@job_router.get("/{job_id}", response_model=JobOut)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.owner_id == current_user.id,
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return job


@job_router.put("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    job_update: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.owner_id == current_user.id,
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    for field, value in job_update.model_dump().items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)

    return job


@job_router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.owner_id == current_user.id,
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    db.delete(job)
    db.commit()

    return None