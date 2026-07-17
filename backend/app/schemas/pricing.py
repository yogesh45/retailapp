from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class PricingResponse(BaseModel):
    id: int
    store_id: str
    sku: str
    product_name: str
    price: Decimal = Field(
        examples=[Decimal("84999.00")]
    )
    pricing_date: date
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "store_id": "STORE001",
                "sku": "SKU1001",
                "product_name": "Apple iPhone 16",
                "price": "84999.00",
                "pricing_date": "2026-07-16",
            }
        },
    )


class PricingUpdateRequest(BaseModel):
    price: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )


class PricingListResponse(BaseModel):
    items: list[PricingResponse]
    page: int
    page_size: int
    total_records: int
    total_pages: int