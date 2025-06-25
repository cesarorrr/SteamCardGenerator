from fastapi import APIRouter, HTTPException
from app.services.steam_service import get_steam_user_data

router = APIRouter()

@router.get("/steam-user/{steam_id}")
async def steam_user(steam_id: str):
    try:
        return await get_steam_user_data(steam_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")
