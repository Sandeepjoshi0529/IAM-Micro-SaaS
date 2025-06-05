import jwt
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "8520")  # Ensure this matches `generate_jwt.py`
ALGORITHM = "HS256"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NDg5MjI2MTAuNjk4OTk2fQ.0VpLDz64gmMMxS5_3_dpxaEj_i37jhnl8s0B_dw3gm4"  # ✅ Replace with your generated JWT

try:
    decoded = jwt.decode(TOKEN, SECRET_KEY, algorithms=[ALGORITHM])
    print("✅ Decoded Token Payload:", decoded)
except jwt.ExpiredSignatureError:
    print("🚨 Token expired")
except jwt.DecodeError:
    print("🚨 Invalid token format")
except jwt.InvalidTokenError:
    print("🚨 Invalid token")
