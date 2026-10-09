import os
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from app.core.settings import settings


def init_db(db: Session) -> None:
    admin_email = settings.FIRST_SUPERUSER_EMAIL
    admin_password = settings.FIRST_SUPERUSER_PASSWORD

    existing_admin = (db.query(User).filter((User.role == UserRole.ADMIN) | (User.is_admin == True)).first())
    if not existing_admin:
        admin_user = User(
            email=admin_email,
            hashed_password=get_password_hash(admin_password),
            is_active=True,
            role=UserRole.ADMIN,
            is_admin=True,
        )
        db.add(admin_user)
        db.commit()
        print(f"[+] Дефолтный администратор успешно создан: {admin_email}")