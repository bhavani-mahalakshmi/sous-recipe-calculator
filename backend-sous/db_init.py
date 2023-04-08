import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# create an engine and session to connect to the database
user=os.environ['DB_USERNAME']
password=os.environ['DB_PASSWORD']
db = os.environ['DB_NAME']
engine = create_engine(f'postgresql://{user}:{password}@localhost:5432/{db}')
Session = sessionmaker(bind=engine)
session = Session()
