# User schemas for FastAPI - defines data structure for requests and responses
# Simple junior level, matches other schema files like order_schema.py

from pydantic import BaseModel

# Schema for creating a new user (register/login)
class UserCreate(BaseModel):
    username: str      # Unique username
    password: str      # Password (will be hashed on server)

# Schema for user response (no password)
class User(BaseModel):
    id: int            # Unique user ID
    username: str      # Username
    role: str = 'waiter'  # User role: admin, manager, waiter
    created_at: str    # When user was created
    updated_at: str    # When last updated

# Schema for updating user
class UserUpdate(BaseModel):
    username: str | None = None
    role: str | None = None
