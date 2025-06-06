from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
import datetime

from database import Base  # ✅ Import Base from `database.py`

# Define Users Table
class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "public"}  # ✅ Ensure table is in public schema

    id = Column(Integer, primary_key=True, autoincrement=True)  # ✅ Primary Key
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))

# Define RevokedToken Table for Token Revocation
class RevokedToken(Base):
    __tablename__ = "revoked_tokens"
    __table_args__ = {"schema": "public"}  # ✅ Ensure table is in public schema

    id = Column(Integer, primary_key=True, autoincrement=True)  # ✅ Primary Key
    token = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
