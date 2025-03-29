from fastapi import APIRouter
from .routes import router as reports_router

# Criar o router principal da API
api_router = APIRouter()

# Incluir os routers das APIs
api_router.include_router(reports_router, tags=["reports"]) 