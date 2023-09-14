from datetime import datetime

import uvicorn
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from starlette.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from db.connection import EngineConn
from db.models import ResultRecord
from routes.chatgpt import ChatGPT
from schema.chatgpt_schema import CheckDataFood, CheckDataCollect
from routes.ranking import Ranking

app = FastAPI()
engine = EngineConn()
origins = [
    "http://localhost",
    "http://127.0.0.1"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Jinja2 템플릿
templates = Jinja2Templates(directory='templates/')
# 정적 디렉토리
app.mount("/static", StaticFiles(directory="web"), name="static")


# 웹
@app.get("/")
async def web(request: Request):
    return templates.TemplateResponse('index.html',
                                      {'request': request})

@app.post("/food")
async def get_food(data: CheckDataFood):
    chat_gpt = ChatGPT()
    return chat_gpt.get_answer(data)


@app.post("/data")
async def collect_data(data: CheckDataCollect):
    session = engine.session_maker()
    today = datetime.now()
    new_record = ResultRecord(season=data.season,
                              weather=data.weather,
                              meals=data.mealtime,
                              mood=data.mood,
                              allergy=' '.join(data.allergies),
                              result_food=data.result_food,
                              date=today)

    session.add(new_record)

    try:
        session.commit()
        return JSONResponse(content="Succeed", status_code=200)
    except:
        session.rollback()
        return JSONResponse(content="Failed", status_code=500)
    finally:
        session.close()


@app.get("/ranking")
async def get_ranking():
    session = engine.session_maker()
    ranking = Ranking(session)
    return ranking.get_ranking()

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
