import os
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.core.security import get_password_hash


def init_db(db: Session) -> None:
    admin_email = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@admin.com")
    admin_password = os.getenv("FIRST_SUPERUSER_PASSWORD", "admin12345")

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