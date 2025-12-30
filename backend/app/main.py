"""
FastAPI application for Financial Calculators
Production-ready with comprehensive endpoints
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import life_goal, financial, quick_tools

# Environment configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

app = FastAPI(
    title="Financial Calculators API",
    description="Production-grade financial calculation endpoints",
    version="1.0.0",
    debug=DEBUG
)

# CORS configuration - supports both development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ENVIRONMENT == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(life_goal.router, prefix="/api/life-goal", tags=["Life Goal Calculators"])
app.include_router(financial.router, prefix="/api/financial", tags=["Financial Calculators"])
app.include_router(quick_tools.router, prefix="/api/quick-tools", tags=["Quick Tools"])

@app.get("/")
async def root():
    return {
        "message": "Financial Calculators API",
        "version": "1.0.0",
        "environment": ENVIRONMENT,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": ENVIRONMENT,
        "version": "1.0.0"
    }
