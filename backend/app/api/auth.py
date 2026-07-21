from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse
from app.core.dependencies import get_current_user, require_admin

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

@router.post(
    "/login",
    response_model=LoginResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
) -> LoginResponse:
    logger.info(
        "Login attempt email=%s",
        login_data.email,
    )

    statement = select(User).where(
        User.email == login_data.email
    )

    user = db.scalar(statement)

    if user is None:
        logger.info(
            "Login Attempt Failed email=%s reason=invalid_credentials",
            login_data.email
        )
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        logger.warning(
            "Login failed email=%s reason=invalid_credentials",
            login_data.email,
        )
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    

    if not user.is_active:
        logger.warning(
            "Login failed email=%s reason=Account is inactive",
            login_data.email,
        )
        return HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    
    access_token = create_access_token(
        user_id=user.id,
        email= user.email,
        role=user.role
    )

    logger.info(
        "Login successful user_id=%s role=%s",
        user.id,
        user.role.value,
    )

    return LoginResponse(
        access_token=access_token,
        role=user.role.value,
        email=user.email,
    )

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role.value,
    }

@router.get("/admin-test")
def admin_test(
    current_user: User = Depends(require_admin),
):
    return {
        "message": "Admin access granted",
        "email": current_user.email,
    }