from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus
from urllib import parse

#SQLALCHEMY_DATABASE_URL = create_engine('postgresql://postgres:%@localhost/blogs' % quote('arun@750Arun'))
#engine =create_engine(SQLALCHEMY_DATABASE_URL)#,connect_args={'check_same_thread':False})
engine = create_engine("postgresql://bloguser:blog1234@localhost/blogs")
SessionLocal = sessionmaker(bind=engine,autocommit=False, autoflush=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()