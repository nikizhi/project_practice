from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import SessionLocal
from app.core.init_db import init_db
from app.core.settings import settings
from app.models.ingredient import Ingredient
from app.api.auth import router as auth_router
from app.api.recipes import router as recipes_router
from app.api.inventory import router as inventory_router
from app.api.match import router as match_router
from app.api.ingredients import router as ingredients_router
from app.api.favorites import router as favorites_router
from app.api.users import router as users_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        init_db(db)
        default_ingredients = [
            {"name": "Соль", "category": "Специи", "unit": "г"},
            {"name": "Перец", "category": "Специи", "unit": "г"},
            {"name": "Вода", "category": "Жидкости", "unit": "мл"},
            {"name": "Сахар", "category": "Бакалея", "unit": "г"},
            {"name": "Мука", "category": "Бакалея", "unit": "г"},
            {"name": "Масло растительное", "category": "Бакалея", "unit": "мл"},
        ]
        names_to_check = [ing["name"] for ing in default_ingredients]
        existing_names = set(name[0] for name in db.query(Ingredient.name).filter(Ingredient.name.in_(names_to_check)).all())
        new_ingredients = [
            Ingredient(**ing_data)
            for ing_data in default_ingredients
            if ing_data["name"] not in existing_names
        ]
        if new_ingredients:
            db.bulk_save_objects(new_ingredients)
            db.commit()
            print(f"[+] Успешно добавлено новых ингредиентов: {len(new_ingredients)}")
            
    except Exception as e:
        db.rollback()
        print(f"Ошибка при инициализации данных при старте: {e}")
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.APP_TITLE,
    description="Backend API для конструктора рецептов по остаткам в холодильнике",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(ingredients_router, prefix="/api")
app.include_router(recipes_router, prefix="/api")
app.include_router(inventory_router, prefix="/api")
app.include_router(match_router, prefix="/api")
app.include_router(favorites_router, prefix="/api")
app.include_router(users_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to RecipeGeni API! Docs at /docs"}