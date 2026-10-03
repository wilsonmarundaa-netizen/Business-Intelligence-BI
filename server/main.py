from fastapi import FastAPI
from businesses.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
     router,
     prefix="/businesses"
    
    )

@app.get("/")
def home():
    return{
        "message": "home"
    
}