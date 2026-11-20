from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health
from app.core.config import settings

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "ParcelTrack Backend API — Parcel registration and tracking system "
        "for transport agencies in Cameroon."
    ),
    version="0.1.0",
)

# Configure CORS for local Vite development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route controllers
app.include_router(health.router)
