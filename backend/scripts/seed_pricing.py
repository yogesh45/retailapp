from datetime import date
from decimal import Decimal

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.pricing import PricingRecord


SAMPLE_PRICING = [
    {
        "store_id": "STORE001",
        "sku": "SKU1001",
        "product_name": "Apple iPhone 16",
        "price": Decimal("79999.00"),
        "pricing_date": date(2026, 7, 16),
    },
    {
        "store_id": "STORE001",
        "sku": "SKU1002",
        "product_name": "Samsung Galaxy S26",
        "price": Decimal("69999.00"),
        "pricing_date": date(2026, 7, 16),
    },
    {
        "store_id": "STORE002",
        "sku": "SKU1003",
        "product_name": "Sony Headphones",
        "price": Decimal("14999.00"),
        "pricing_date": date(2026, 7, 16),
    },
    {
        "store_id": "STORE002",
        "sku": "SKU1004",
        "product_name": "Dell XPS Laptop",
        "price": Decimal("129999.00"),
        "pricing_date": date(2026, 7, 16),
    },
    {
        "store_id": "STORE003",
        "sku": "SKU1005",
        "product_name": "Apple Watch",
        "price": Decimal("39999.00"),
        "pricing_date": date(2026, 7, 16),
    },
]


def seed_pricing() -> None:
    db = SessionLocal()

    try:
        for pricing in SAMPLE_PRICING:

            statement = select(PricingRecord).where(
                PricingRecord.store_id == pricing["store_id"],
                PricingRecord.sku == pricing["sku"],
                PricingRecord.pricing_date == pricing["pricing_date"],
            )

            existing = db.scalar(statement)

            if existing:
                print(
                    f"Already exists : {pricing['sku']}"
                )
                continue

            record = PricingRecord(
                **pricing,
                created_by=2,
                updated_by=2,
            )

            db.add(record)

        db.commit()

        print("Pricing records seeded successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_pricing()