from fastapi import APIRouter


router = APIRouter(tags=["server"],
                    responses={404: {"message": "No encontrado"}})

@router.get("/getserverlist")
async def products():
    return ("Acabas de ralizar una petición get")

@router.get("/{id}")
async def products():
    return [id]
