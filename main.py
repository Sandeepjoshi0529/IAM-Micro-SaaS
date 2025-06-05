import logging
import datetime
import os
import jwt

from fastapi import FastAPI, Depends, HTTPException, APIRouter, Security
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, DateTime, text
from dotenv import load_dotenv

from database import get_db, Base, engine  # ✅ Import engine from `database.py`

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("🚨 DATABASE_URL is missing! Check your .env file.")

# Ensure Database Schema is Fully Synced
Base.metadata.create_all(bind=engine)

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret")
ALGORITHM = "HS256"

# Initialize FastAPI app
app = FastAPI(title="IAM Micro SaaS API", description="JWT-based authentication with token revocation.")

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Authentication Router
auth_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# User Authentication Model
class TokenData(BaseModel):
    refresh_token: str

# Revoked Token Model
class RevokedToken(Base):
    __tablename__ = "revoked_tokens"
    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String, unique=True, nullable=False)
    revoked_at = Column(DateTime, default=datetime.datetime.utcnow)

# Token Generation Functions
def create_access_token(user_id: str, role: str):
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
    return jwt.encode({"sub": user_id, "role": role, "exp": expire.timestamp()}, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: str, role: str):
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    return jwt.encode({"sub": user_id, "role": role, "exp": expire.timestamp()}, SECRET_KEY, algorithm=ALGORITHM)

# Token Revocation Functions
def revoke_token(db: Session, token: str):
    revoked_entry = RevokedToken(token=token)
    db.add(revoked_entry)
    db.commit()
    logger.info(f"🚨 Token revoked: {token}")

def is_token_revoked(db: Session, token: str):
    revoked = db.query(RevokedToken).filter(RevokedToken.token == token).first() is not None
    if revoked:
        logger.warning(f"🚨 Attempted use of revoked token: {token}")
    return revoked

# Fetch Role-Based Permissions from Database
def get_user_permissions(db: Session, role_name: str):
    """ Fetch permissions dynamically based on user role """
    query = text("SELECT permissions FROM roles WHERE role_name = :role")  
    result = db.execute(query, {"role": role_name}).fetchone()

    if result:
        permissions_list = result[0] if isinstance(result[0], list) else list(result[0])  
        logger.info(f"✅ Fetched permissions for '{role_name}': {permissions_list}")  
        return permissions_list
    logger.warning(f"🚨 No permissions found for role '{role_name}'!")
    return []

# Extract User Role While Blocking Revoked Tokens
def get_current_user_role(token: str = Security(oauth2_scheme)):
    db = next(get_db())  

    logger.info(f"🔍 Received Token: {token}")  

    if is_token_revoked(db, token):
        raise HTTPException(status_code=403, detail="Token revoked")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_role = payload.get("role", "guest")
        logger.info(f"✅ Decoded Token: Role = {user_role}")  
        return user_role
    except jwt.ExpiredSignatureError:
        logger.warning("❌ Token Expired!")
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.DecodeError:
        logger.error("❌ Token Format Invalid!")
        raise HTTPException(status_code=403, detail="Invalid token format")
    except jwt.InvalidTokenError:
        logger.error("❌ Invalid Token!")
        raise HTTPException(status_code=403, detail="Invalid token")

# Verify Access Based on Role Permissions
def verify_access(role_name: str, required_permission: str):
    db = next(get_db())  

    permissions = get_user_permissions(db, role_name)
    if required_permission not in permissions:
        logger.warning(f"🚨 Permission '{required_permission}' DENIED for '{role_name}'!")
        raise HTTPException(status_code=403, detail="Permission denied")
    
    logger.info(f"✅ Permission '{required_permission}' GRANTED for '{role_name}'")

# Health Check Route
@app.get("/db-status", tags=["Health"])
def db_status():
    db = next(get_db())  

    try:
        db.execute(text("SELECT 1"))
        return {"status": "Database connected successfully"}
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

# Protected API Endpoints
@app.get("/admin-data", tags=["Admin"])
def admin_only_data(role: str = Depends(get_current_user_role)):
    verify_access(role, "create_user")  
    return {"data": "Confidential admin information"}

@app.get("/user-profile", tags=["User"])
def user_profile(role: str = Depends(get_current_user_role)):
    verify_access(role, "update_profile")  
    return {"profile": "User profile details"}

@app.get("/reports", tags=["Guest"])
def view_reports(role: str = Depends(get_current_user_role)):
    verify_access(role, "view_reports")  
    return {"reports": "General system reports"}

# Include authentication routes
app.include_router(auth_router)
