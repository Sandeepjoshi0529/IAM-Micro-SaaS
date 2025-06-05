import jwt
import datetime
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import get_db  # Import DB session dependency

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "change_this_secret")  # 🔹 Use a stronger default value!
ALGORITHM = "HS256"

def create_access_token(user_id: str, role: str):
    """ Generate JWT with expiration time """
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
    return jwt.encode({"sub": user_id, "role": role, "exp": expire.timestamp()}, SECRET_KEY, algorithm=ALGORITHM)

def is_token_expired(token: str) -> bool:
    """ Check if a JWT has expired based on its 'exp' claim """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp_timestamp = payload.get("exp", 0)  # 🔹 Ensure default value for missing exp
        current_timestamp = datetime.datetime.now(datetime.timezone.utc).timestamp()
        return exp_timestamp < current_timestamp
    except jwt.ExpiredSignatureError:
        return True
    except jwt.InvalidTokenError:  # 🔹 Put InvalidTokenError before DecodeError
        return True
    except jwt.DecodeError:
        return True

def store_expired_token(db: Session, token: str):
    """ Save expired tokens in the database for security logging """
    try:
        db.execute("INSERT INTO expired_tokens (token) VALUES (:token)", {"token": token})
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"❌ Database error while storing token: {e}")

# Generate Admin Token for Testing
token = create_access_token("123", "admin")
print("Generated JWT:", token)

# Example Usage:
with get_db() as db:  # 🔹 Use context manager to manage session properly
    if is_token_expired(token):
        store_expired_token(db, token)
        print("❌ Token has expired and has been logged!")
    else:
        print("✅ Token is still valid.")
