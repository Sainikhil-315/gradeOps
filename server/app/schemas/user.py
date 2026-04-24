"""
Pydantic schemas for User API validation.
Separate from ORM models (app/models/user.py).

These define request/response formats for FastAPI endpoints.
Use for request body validation, response serialization, and OpenAPI docs.

Example:
    @app.post("/users", response_model=UserResponse)
    def create_user(user: UserCreate, session: Session = Depends(get_db_session)):
        # user is already validated by Pydantic
        ...
"""

from typing import Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field, EmailStr, field_validator


class UserRoleEnum(str, Enum):
    """Valid user roles."""
    INSTRUCTOR = "instructor"
    TA = "ta"


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr = Field(..., description="User email address")
    role: UserRoleEnum = Field(..., description="User role: instructor or ta")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    
    @field_validator("email")
    @classmethod
    def email_must_be_valid_domain(cls, v):
        """Additional email validation if needed."""
        # Add custom validation (e.g., must be from specific domain)
        return v.lower()


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    email: Optional[EmailStr] = Field(None, description="New email address")
    role: Optional[UserRoleEnum] = Field(None, description="New role")
    
    class Config:
        # Allow at least one field to be updated
        min_anystr_length = 1


class UserResponse(UserBase):
    """Schema for user API response."""
    id: str = Field(..., description="User UUID")
    created_at: datetime = Field(..., description="When user was created")
    updated_at: datetime = Field(..., description="When user was last updated")
    
    class Config:
        from_attributes = True  # Support ORM models


class UserListResponse(BaseModel):
    """Schema for list of users."""
    users: list[UserResponse]
    total: int = Field(..., description="Total number of users")


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
    status_code: int = Field(..., description="HTTP status code")
