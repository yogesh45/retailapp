from datetime import date
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.pricing import PricingRecord


class PricingRepository:
    def __init__(self, db: Session):
        self.db = db

    def search(
        self,
        store_id: str | None = None,
        sku: str | None = None,
        product_name: str | None = None,
        pricing_date: date | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[PricingRecord], int]:
        query = select(PricingRecord)

        if store_id:
            query = query.where(
                PricingRecord.store_id == store_id
            )

        if sku:
            query = query.where(
                PricingRecord.sku == sku
            )

        if product_name:
            query = query.where(
                PricingRecord.product_name.ilike(
                    f"%{product_name}%"
                )
            )

        if pricing_date:
            query = query.where(
                PricingRecord.pricing_date == pricing_date
            )

        count_query = select(
            func.count()
        ).select_from(
            query.order_by(None).subquery()
        )

        total_records = self.db.scalar(count_query) or 0

        offset = (page - 1) * page_size

        paginated_query = (
            query
            .order_by(PricingRecord.id.desc())
            .offset(offset)
            .limit(page_size)
        )

        records = list(
            self.db.scalars(paginated_query).all()
        )

        return records, total_records

    def get_by_id(
        self,
        pricing_id: int,
    ) -> PricingRecord | None:
        statement = select(PricingRecord).where(
            PricingRecord.id == pricing_id
        )
        return self.db.scalar(statement)

    def save(
        self,
        pricing_record: PricingRecord,
    ) -> PricingRecord:
        self.db.add(pricing_record)
        self.db.commit()
        self.db.refresh(pricing_record)

        return pricing_record
    
    def update(
        self,
        pricing_record: PricingRecord
    ) -> PricingRecord:
        self.db.add(pricing_record)
        self.db.commit()
        self.db.refresh(pricing_record)
        return pricing_record
    
    def get_by_business_key(
        self,
        store_id: str,
        sku: str,
        pricing_date: date,
    ) -> PricingRecord | None:
        statement = select(PricingRecord).where(
            PricingRecord.store_id == store_id,
            PricingRecord.sku == sku,
            PricingRecord.pricing_date == pricing_date,
        )

        return self.db.scalar(statement)
    
    def upsert_from_csv(
        self,
        store_id: str,
        sku: str,
        product_name: str,
        price: Decimal,
        pricing_date: date,
        user_id: int,
    ) -> PricingRecord:
        record = self.get_by_business_key(
            store_id=store_id,
            sku=sku,
            pricing_date=pricing_date,
        )

        if record:
            record.product_name = product_name
            record.price = price
            record.updated_by = user_id
            return record

        record = PricingRecord(
            store_id=store_id,
            sku=sku,
            product_name=product_name,
            price=price,
            pricing_date=pricing_date,
            created_by=user_id,
            updated_by=user_id,
        )

        self.db.add(record)
        return record
