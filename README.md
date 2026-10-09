# RecipeGeni

Умный кулинарный помощник для управления рецептами, подбора блюд по содержимому холодильника и ведения персональной книги избранного.

---

## 1. Описание проекта

**RecipeGeni** — это современное веб-приложение для любителей готовить. Платформа позволяет не только искать проверенные рецепты с фильтрацией по времени приготовления и названию, но и управлять содержимым собственного холодильника («Инвентарь»), чтобы автоматически подбирать блюда из доступных продуктов. Проект включает в себя полноценную систему авторизации с разграничением ролей (пользователь / администратор) и админ-панель для управления базой рецептов.

---

## 2. Основные возможности

1. Удобно ищите блюда по названию и фильтруйте по максимальному времени приготовления.
2. Управляйте списком продуктов в своем холодильнике.
3. Интеллектуальный подбор блюд на основе имеющихся в наличии ингредиентов.
4. Сохраняйте любимые рецепты в один клик.
5. Добавление, редактирование и удаление рецептов (доступно только администраторам).

---

## 3. Стек технологий

* **Frontend:** React, TypeScript, React Router, Tailwind CSS, Lucide React
* **Backend:** Python, FastAPI, SQLAlchemy, Pydantic, SQLite / PostgreSQL
* **Стилизация и UX:** Адаптивная верстка, кастомные хуки контекста (`AuthContext`), анимации интерфейса.

---

## 4. Структура проекта

```
recipe-geni/
├── frontend/                     # Frontend-часть (React + TypeScript)
│   ├── src/
│   │   ├── api/                  # API-клиенты (auth, recipes, favorites, inventory)
│   │   ├── components/           # Переиспользуемые UI-компоненты (Navbar, Layout, ProtectedRoute, RecipeCard)
│   │   ├── context/              # React Context (AuthContext, ToastContext)
│   │   ├── pages/                # Страницы приложения (RecipesPage, LoginPage, RegisterPage, InventoryPage)
│   │   ├── types/                # TypeScript интерфейсы и типы
│   │   ├── App.tsx               # Главный компонент и роутинг
│   │   └── main.tsx              # Точка входа
│   ├── package.json
│   └── ...
├── app/                      # Серверная часть (Python + FastAPI)
│   ├── api/                  # Эндпоинты/роутеры (auth, recipes, favorites, inventory, users)
│   ├── core/                 # БД, конфигурация, безопасность, JWT, зависимости
│   ├── models/               # SQLAlchemy модели БД (Recipe, User, Ingredient, Favorite)
│   ├── schemas/              # Pydantic схемы для валидации данных
│   └── main.py               # Точка входа FastAPI приложения
├── requirements.txt
└── README.md
```

---

## 5. Переменные окружения проекта

* **APP_TITLE** - название API
* **DATABASE_NAME** - название БД
* **SECRET_KEY** - используется при подписи JWT-токенов
* **FIRST_SUPERUSER_EMAIL** - логин первого администратора (создается автоматически при запуске если его нет в БД)
* **FIRST_SUPERUSER_PASSWORD** - пароль первого администратора

## 6. Запуск проекта

```
# Установка проекта
git clone https://github.com/nikizhi/project_practice

# Делается в корне проекта
pip install -r requirements.txt

# Alembic (инициализация БД)
alembic revision --autogenerate -m "initial_migration"
alembic upgrade head

# Запуск Backend
uvicorn main:app --reload

# Необходимо перейти в папку frontend и установить зависимости
npm install

# Запуск Frontend
npm run dev
```

В итоге Backend откроется в http://127.0.0.1:8000, а Frontend в http://127.0.0.1:5173.
