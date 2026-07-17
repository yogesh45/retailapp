from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import get_settings
from app.core.database import engine
from app.api.auth import router as auth_router
from app.api.pricing import router as pricing_router
from app.api.upload import router as upload_router
from app.core.logging import configure_logging


app_settings = get_settings()


app = FastAPI(
    title=app_settings.app_name,
    version=app_settings.app_version
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

configure_logging()

app.include_router(auth_router)
app.include_router(pricing_router)
app.include_router(upload_router)

@app.get("/")
def root() -> dict[str, str]:
    return  {
        "message" : f"{app_settings.app_name} is running"
    }


@app.get('/health')
def health_check() -> dict[str, str]:
    return {
        "status" : "healthy"
    }

@app.get("/health/database")
def database_health_check() -> dict[str, str]:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
    }