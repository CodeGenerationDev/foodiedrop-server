from sqlalchemy import Column, INT, VARCHAR, DATE
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


# result_record 테이블 모델
class ResultRecord(Base):
    __tablename__ = 'result_record'

    record_id = Column(INT, nullable=False, autoincrement=True, primary_key=True)
    # 계절
    season = Column(VARCHAR, nullable=True)
    # 날씨
    weather = Column(VARCHAR, nullable=True)
    # 식사 시간
    meals = Column(VARCHAR, nullable=True)
    # 기분
    mood = Column(VARCHAR, nullable=True)
    # 알러지 내용
    allergy = Column(VARCHAR, nullable=True)
    # 결과
    result_food = Column(VARCHAR, nullable=False)
    # 날짜
    date = Column(DATE, nullable=False)
