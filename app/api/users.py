from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.api.deps import get_current_admin
from app.models.user import User, UserRole
from app.schemas.user import UserResponse, UserRoleUpdate

router = APIRouter(prefix="/users", tags=["Users Management (Admin)"])

@router.get("/", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    users = db.query(User).all()
    return users
@router.patch("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    if user.id == current_admin.id and role_update.role != UserRole.ADMIN:
        raise HTTPException(status_code=400, detail="Вы не можете снизить собственные административные права")

    user.role = role_update.role
    user.is_admin = (role_update.role == UserRole.ADMIN)

    db.commit()
    db.refresh(user)
    return user