import logging
from datetime import date
from math import ceil

from sqlalchemy.orm import Session
from decimal import Decimal

from app.repositories.pricing_repository import PricingRepository
from app.models.user import User
from app.schemas.pricing import (
    PricingListResponse,
    PricingResponse,
)


logger = logging.getLogger(__name__)


class PricingService:
    def __init__(self, db: Session):
        self.repository = PricingRepository(db)

    def search_pricing(
        self,
        store_id: str | None = None,
        sku: str | None = None,
        product_name: str | None = None,
        pricing_date: date | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> PricingListResponse:
        logger.info(
            (
                "Searching pricing records "
                "store_id=%s sku=%s product_name=%s "
                "pricing_date=%s page=%s page_size=%s"
            ),
            store_id,
            sku,
            product_name,
            pricing_date,
            page,
            page_size,
        )

        records, total_records = self.repository.search(
            store_id=store_id,
            sku=sku,
            product_name=product_name,
            pricing_date=pricing_date,
            page=page,
            page_size=page_size,
        )

        total_pages = (
            ceil(total_records / page_size)
            if total_records > 0
            else 0
        )

        response = PricingListResponse(
            items=[
                PricingResponse.model_validate(record)
                for record in records
            ],
            page=page,
            page_size=page_size,
            total_records=total_records,
            total_pages=total_pages,
        )

        logger.info(
            (
                "Pricing search service completed "
                "total_records=%s returned_records=%s"
            ),
            total_records,
            len(response.items),
        )

        return response
    
    def update_price(
        self,
        pricing_id: int,
        new_price: Decimal,
        current_user: User,
    ) -> PricingResponse:
        pricing_record = self.repository.get_by_id(pricing_id)

        if pricing_record is None:
            raise ValueError("Pricing record not found")

        old_price = pricing_record.price

        pricing_record.price = new_price
        pricing_record.updated_by = current_user.id

        updated_record = self.repository.update(pricing_record)

        logger.info(
            (
                "Pricing record updated "
                "pricing_id=%s user_id=%s "
                "old_price=%s new_price=%s"
            ),
            pricing_id,
            current_user.id,
            old_price,
            new_price,
        )

        return PricingResponse.model_validate(updated_record)
    