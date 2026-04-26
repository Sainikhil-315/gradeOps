"""
Authentication routes.

Endpoints:
- POST /auth/register - Register new user
- POST /auth/login - User login (returns token)
- GET /auth/me - Get current user
- GET /auth/users - List all users (admin only)
"""

import logging
from typing import Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
import jwt

from app.core.config import settings
from app.core.dependencies import get_current_user as get_authenticated_user
from app.core.supabase import get_db_session
from app.models import UserRole
from app.schemas import (
    UserCreate, UserResponse, UserListResponse, ErrorResponse
)
from app.services import UserService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Email already exists"},
        422: {"model": ErrorResponse, "description": "Validation error"},
    }
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db_session)
):
    """
    Register a new user (instructor or TA).
    
    Args:
        user: UserCreate with email and role
        db: Database session
        
    Returns:
        Created UserResponse
        
    Raises:
        HTTPException 400: If email already exists
    """
    try:
        # Check if email already exists
        existing_user = UserService.get_user_by_email(db, user.email)
        if existing_user:
            logger.warning(f"Registration attempted with existing email: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email {user.email} is already registered"
            )
        
        # Create user
        db_user = UserService.create_user(db, user)
        
        logger.info(f"User registered: {db_user.email} ({db_user.role})")
        return UserResponse.model_validate(db_user)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user"
        )


@router.post(
    "/login",
    response_model=dict,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
    }
)
def login(
    email: str,
    db: Session = Depends(get_db_session)
):
    """
    Login user (simplified - in production use JWT/OAuth).
    
    Args:
        email: User email
        db: Database session
        
    Returns:
        User data with auth token
        
    Raises:
        HTTPException 401: If user not found
    """
    try:
        user = UserService.get_user_by_email(db, email)
        if not user:
            logger.warning(f"Login attempt for non-existent user: {email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # In production, generate JWT token here
        expires = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token = jwt.encode(
            {"sub": str(user.id), "role": user.role.value, "exp": expires},
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        logger.info(f"User logged in: {email}")
        return {
            "user": UserResponse.model_validate(user),
            "token": token,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to login"
        )


@router.get(
    "/users",
    response_model=UserListResponse,
)
def list_users(
    role: Optional[str] = None,
    db: Session = Depends(get_db_session)
):
    """
    List all users, optionally filtered by role.
    
    Args:
        role: Optional role filter (instructor or ta)
        db: Database session
        
    Returns:
        UserListResponse with users and count
    """
    try:
        users = UserService.get_all_users(db, role=role)
        logger.info(f"Listed {len(users)} users")
        return UserListResponse(
            users=[UserResponse.model_validate(u) for u in users],
            total=len(users)
        )
    except Exception as e:
        logger.error(f"Error listing users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list users"
        )


@router.get(
    "/me",
    response_model=UserResponse,
    responses={
        401: {"model": ErrorResponse, "description": "User not found"},
    }
)
def get_me(
    current_user=Depends(get_authenticated_user),
):
    """
    Get current authenticated user.
    
    Args:
        user_id: Current user UUID
        db: Database session
        
    Returns:
        UserResponse
        
    Raises:
        HTTPException 401: If user not found
    """
    try:
        return UserResponse.model_validate(current_user)
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user"
        )
