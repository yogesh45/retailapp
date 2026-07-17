import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

class UserRole(str, enum.Enum):
    VIEWER = "VIEWER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__  = "users"
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )
    email: Mapped[str] = mapped_column(
        String(225),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash:Mapped[str] = mapped_column(
        String(225),
        nullable=False
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, nam="user_role"),
        nullable=False
    )

    is_active:Mapped[bool]  = mapped_column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )
