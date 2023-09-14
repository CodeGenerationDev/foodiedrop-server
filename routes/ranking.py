from datetime import date

from db.connection import EngineConn
from db.models import ResultRecord


class Ranking:
    def __init__(self, session):
        self.session = session

    def get_ranking(self):
        # 오늘 날짜를 today 변수에 저장
        today = date.today()
        # today_records에는 ResultRecord 테이블에서 오늘 날짜의 데이터들만 불러와 today_reocrds에 저장함.
        today_records = self.session.query(ResultRecord).filter(ResultRecord.date == today).all()
        # food_count 딕셔너리는 각 음식별 횟수를 저장히기 위함
        food_counts = {}
        for record in today_records:
            # record의 result_food 값을 불러옴.
            food = record.result_food
            # 딕셔너리에 값이 없다면 0 + 1... 있다면 food + 1
            food_counts[food] = food_counts.get(food, 0) + 1

        # items.. 숫자 기준으로 정렬하여 저장
        sorted_food_counts = sorted(food_counts.items(), key=lambda x: x[1], reverse=True)

        # 정렬한 0 ~ 2번째의 음식을 리스트에 담음.
        top_foods = [food_counts[0] for food_counts in sorted_food_counts[:3]]

        # 세션 닫고 리턴.
        self.session.close()
        return top_foods

