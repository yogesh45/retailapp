from datetime import datetime,timezone, timedelta

import jwt
from pwdlib import PasswordHash

from app.core.config import get_settings

app_settings = get_settings()
password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hash_password: str ) -> bool:
    return password_hash.verify(
        password, hash_password
    )

def create_access_token(
        user_id: int,
        email: str,
        role: str
) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=app_settings.jwt_access_token_expire_minutes
    )

    payload = {
        "sub" : str(user_id),
        "email" : email,
        "role" : role,
        "exp" : expires_at
    }

    return jwt.encode(
        payload,
        app_settings.jwt_secret_key,
        algorithm=app_settings.jwt_algorithm
    )