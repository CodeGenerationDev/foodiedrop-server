import openai
import json
from dotenv import load_dotenv
import os

load_dotenv()

### 명늘이의 job ###
# System 설정을 변경할 수 있도록 . (문장 개수 등등)
# 7/29 오류가 있는지 지속적으로 체크함

### 승늘이의 job ###
# 안드로이드에서 발송된 json 데이터가 들어오면 그걸 질문으로 변경하는 함수가 필요함


class ChatGPT:
    # 싱글톤 패턴으로 chatGPT API 통신
    __instance = None

    def __new__(cls):
        if cls.__instance is None:
            cls.__instance = super(ChatGPT, cls).__new__(cls)
            openai.api_key = os.environ.get('OPENAI_API_KEY')
        return cls.__instance

    def __chat_with_gpt(self, messages):
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        chat_response = completion.choices[0].message['content']
        json_obj = json.loads(chat_response)
        return json_obj

    def make_question(self, data):
        python_dict = data.dict()

        # 각 키에 따른 문장을 만들기 위한 템플릿 딕셔너리
        templates = {
            "season": "계절은 {}입니다",
            "weather": "날씨는 {}입니다",
            "time": "현재 시간은 {}입니다",
            "mood": "기분은 {}입니다",
            "allergies": "알레르기는 {}입니다"
        }

        sentence_parts = []
        # 딕셔너리의 각 키-값 쌍에 대해 문장 생성
        for key, value in python_dict.items():
            if value is not None:  # 'None' 값은 제외
                sentence_parts.append(templates[key].format(value))

        # 문장 부분들을 하나의 문자열로 합침
        sentence = ", ".join(sentence_parts)

        return sentence

    # GPT API에 질의하여 리턴.
    def get_answer(self, data):
        # 폴더에서 목록을 가져오도록 변경(web/img/food/) - 김승운
        food_emoji = "web/img/food/"
        emoji_list = []

        # 이모지 파일 이름 list에 저장
        for i in os.listdir(food_emoji):
            if(i.endswith('.png')):
                emoji_list.append(i)

        msg = self.make_question(data)

        messages = [
            {"role": "system","content": "사용자의 질문으로 계절과 날씨, 시간, 기분 정보가 기본으로 주어지고, 알러지 정보가"
                                         "선택사항으로 주어진다."
                                         "이에 알맞는 음식 이름과 음식 이유 3개를 한글로 다음과 같은 방식으로 반환한다. "
                                         "{\"food1\": {\"name\": \"(음식1 이름)\", \"reason\": \"(음식1 이유)\", "
                                         "\"emoji\": \"(음식1과 연관된 이모지 링크)\"}, "
                                         "\"food2\": {\"name\": \"(음식2 이름)\", \"reason\": \"(음식2 이유)\", "
                                         "\"emoji\": \"(음식2과 연관된 이모지 링크)\"}, "
                                         "\"food3\": {\"name\": \"(음식3 이름)\", \"reason\": \"(음식3 이유)\", "
                                         "\"emoji\": \"(음식3과 연관된 이모지 링크)\"}}.  "
                                         "음식 이름은 명사로만 반환한다."
                                         "음식 이유는 2문장으로 작성하되, 반말로 작성하지 않고, 40자가 넘지 않도록 한다."
                                         f"여기서 emoji는 {emoji_list}와 같이 제공된다."
                                         f"emoji는 반드시 넣고, 음식 이름과 알맞은 emoji가 없을 경우에는 유사한 emoji를 사용한다."},
            {"role": "user", "content": f"{msg}"},
        ]
        data = self.__chat_with_gpt(messages)

        for key, value in data.items():
            if not value['emoji'] in emoji_list:
                value['emoji'] = "fork-and-knife-with-plate.png"

        return data