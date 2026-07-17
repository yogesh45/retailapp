from datetime import datetime, date
from decimal import Decimal

from sqlalchemy import Date, DateTime, Integer, Numeric, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

class PricingRecord(Base):
    __tablename__ = "pricing_records"

    __table_args__ = (
        UniqueConstraint(
            "store_id",
            "sku",
            "pricing_date",
            name="uq_pricing_store_sku_date",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    store_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )

    sku: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index = True
    )

    product_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    pricing_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    created_by: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    updated_by: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )