from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


# GPT API와 통신하는 getFood 함수 데이터 검증
class CheckDataFood(BaseModel):
    season: str = Field(...)
    weather: str = Field(...)
    time: str = Field(...)
    mood: str = Field(...)
    allergies: Optional[List[str]]

    @field_validator('season')
    def check_season(cls, v):
        if v not in ["spring", "summer", "fall", "winter"]:
            raise ValueError('must be in season words.')
        return v

    @field_validator('weather')
    def check_weather(cls, v):
        if v not in ["sunny", "cloudy", "rain", "snow"]:  # 맑음, 구름, 비, 눈
            raise ValueError('must be in weather words.')
        return v

    @field_validator('time')
    def check_time(cls, v):
        if v not in ["morning", "day", "evening", "night"]:  # 아침 낮(점심) 저녁 야간
            raise ValueError('must be in time words.')
        return v

    @field_validator('mood')
    def check_mood(cls, v):
        if v not in ["happy", "sad", "sleepy", "idk", "angry", "sick"]:
            raise ValueError('must be in mood words.')
        return v

    @field_validator('allergies')
    def check_allergies(cls, v):
        allergies_list = ["메밀", "밀", "대두", "견과류", "복숭아", "토마토", "난류",
                          "우유", "육류", "갑각류", "고등어", "오징어", "조개류", "아황산"]

        if isinstance(v, list):
            for item in v:
                if item not in allergies_list:
                    raise ValueError(f'{item} is not in allergies')
        else:
            if v not in allergies_list:
                raise ValueError(f'{v}is not in allergies')

        return v


# 완성된 데이터를 DB에 저장하는 collectData 함수 데이터 검증
class CheckDataCollect(BaseModel):
    season: str = Field(...)
    weather: str = Field(...)
    mealtime: str = Field(...)
    mood: str = Field(...)
    allergies: Optional[List[str]]
    result_food: str = Field(...)

    @field_validator('season')
    def check_season(cls, v):
        if v not in ["spring", "summer", "fall", "winter"]:
            raise ValueError('must be in season words.')
        return v

    @field_validator('weather')
    def check_weather(cls, v):
        if v not in ["sunny", "cloudy", "rain", "snow"]:  # 맑음, 비, 흐림,
            raise ValueError('must be in weather words.')
        return v

    @field_validator('mealtime')
    def check_time(cls, v):
        if v not in ["morning", "day", "evening", "night"]:  # 아침 낮(점심) 저녁 야간
            raise ValueError('must be in time words.')
        return v

    @field_validator('mood')
    def check_mood(cls, v):
        if v not in ["happy", "sad", "celebrating", "sleepy", "idk", "angry", "cold"]:
            raise ValueError('must be in mood words.')
        return v

    @field_validator('allergies')
    def check_allergies(cls, v):
        allergies_list = ["메밀", "밀", "대두", "견과류", "복숭아", "토마토", "난류",
                          "우유", "육류", "갑각류", "고등어", "오징어", "조개류", "아황산"]

        if isinstance(v, list):
            for item in v:
                if item not in allergies_list:
                    raise ValueError(f'{item} is not in allergies')
        else:
            if v not in allergies_list:
                raise ValueError(f'{v}is not in allergies')

        return v


class CheckDataImage(BaseModel):
    foods: Optional[List[str]]

    @field_validator('foods')
    def check_len(cls, v):
        if len(v) != 3:
            raise ValueError(f'len of {v} is not 3')
        return v
