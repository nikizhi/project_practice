from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import ALGORITHM, SECRET_KEY
from app.models.user import User, UserRole
from app.schemas.user import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

credentials_exception = HTTPException(
    status_code=401,
    detail="Не удалось валидировать учетные данные",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_raw = payload.get("sub")
        if user_id_raw is None:
            raise credentials_exception
        user_id = int(user_id_raw)
        token_data = TokenData(user_id=user_id)
    except (JWTError, ValueError):
        raise credentials_exception
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception
    if hasattr(user, 'is_active') and not getattr(user, 'is_active'):
        raise HTTPException(status_code=400, detail="Пользователь неактивен")

    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    is_admin_flag = getattr(current_user, 'is_admin', False)
    if current_user.role != UserRole.ADMIN and not is_admin_flag:
        raise HTTPException(
            status_code=403,
            detail="Недостаточно прав администратора"
        )
    return current_user