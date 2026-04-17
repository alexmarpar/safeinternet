from fastapi import FastAPI
from routers import getserver

app = FastAPI()

app.include_router(getserver.router)

@app.get("/")
async def read_root():
    return {"Hello_main.py": "World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
