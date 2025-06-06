from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("🚨 DATABASE_URL is missing! Check your .env file.")

engine = create_engine(DATABASE_URL)

# ✅ Explicitly bind metadata before table creation
Base = declarative_base()
Base.metadata.bind = engine  # 🚀 Ensures models are correctly linked to the DB

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Ensure database schema persists when FastAPI starts
from sqlalchemy.orm import Session

session = Session(bind=engine)
Base.metadata.create_all(bind=engine, checkfirst=False)
session.commit()  # ✅ Explicitly commit schema changes
session.close()

print("✅ Database schema successfully registered in PostgreSQL!")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
