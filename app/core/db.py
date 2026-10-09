from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.core.base import Base
from app.core.settings import settings

DATABASE_URL = f"sqlite:///./{settings.DATEBASE_NAME}.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()