from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole

DEMO_USERS = [
    {
        "email": "viewer@retail.com",
        "password": "Viewer@123",
        "role": UserRole.VIEWER,
    },
    {
        "email": "admin@retail.com",
        "password": "Admin@123",
        "role": UserRole.ADMIN,
    },
]

def seed_users() -> None:
    db = SessionLocal()
    try :
        for user_data in DEMO_USERS:
            statement = select(User).where(
                User.email == user_data["email"]
            )

            existinguser = db.scalar(statement)
            if existinguser:
                print(f"User already exists: {user_data['email']}")
                continue
            user = User(
                email=user_data["email"],
                password_hash=hash_password(
                    user_data["password"]
                ),
                role=user_data["role"],
                is_active=True,
            )
            db.add(user)
        db.commit()
        print("User Saved Successfully")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()