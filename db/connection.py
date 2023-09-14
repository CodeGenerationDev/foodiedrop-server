from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()


# 데이터베이스 연결
class EngineConn:
    def __init__(self):
        self.engine = create_engine(os.environ.get('DB_URL'), pool_recycle=500)

    def session_maker(self):
        Session = sessionmaker(bind=self.engine)
        session = Session()
        return session

    def connection(self):
        conn = self.engine.connect()
        return conn