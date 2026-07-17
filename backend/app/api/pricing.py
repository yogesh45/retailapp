import logging
from datetime import date

from fastapi import HTTPException, Path, status
from fastapi import APIRouter, Depends, Query

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.pricing import PricingListResponse
from app.services.pricing_service import PricingService

from app.core.dependencies import require_admin
from app.schemas.pricing import PricingResponse, PricingUpdateRequest


logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/api/v1/pricing",
    tags=["Pricing"],
)


@router.get(
    "",
    response_model=PricingListResponse,
)
def search_pricing(
    store_id: str | None = None,
    sku: str | None = None,
    product_name: str | None = None,
    pricing_date: date | None = None,
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PricingListResponse:
    logger.info(
        (
            "Pricing search started "
            "user_id=%s store_id=%s sku=%s "
            "product_name=%s pricing_date=%s "
            "page=%s page_size=%s"
        ),
        current_user.id,
        store_id,
        sku,
        product_name,
        pricing_date,
        page,
        page_size,
    )

    try:
        service = PricingService(db)

        response = service.search_pricing(
            store_id=store_id,
            sku=sku,
            product_name=product_name,
            pricing_date=pricing_date,
            page=page,
            page_size=page_size,
        )

        logger.info(
            (
                "Pricing search completed "
                "user_id=%s total_records=%s "
                "returned_records=%s"
            ),
            current_user.id,
            response.total_records,
            len(response.items),
        )

        return response

    except Exception:
        logger.exception(
            "Pricing search failed user_id=%s",
            current_user.id,
        )
        raise

@router.put(
    "/{pricing_id}",
    response_model=PricingResponse,
)
def update_pricing(
    pricing_data: PricingUpdateRequest,
    pricing_id: int = Path(ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> PricingResponse:
    logger.info(
        "Pricing update started pricing_id=%s user_id=%s",
        pricing_id,
        current_user.id,
    )

    service = PricingService(db)

    try:
        response = service.update_price(
            pricing_id=pricing_id,
            new_price=pricing_data.price,
            current_user=current_user,
        )

        logger.info(
            "Pricing update completed pricing_id=%s user_id=%s",
            pricing_id,
            current_user.id,
        )

        return response

    except ValueError as exc:
        logger.warning(
            "Pricing update failed pricing_id=%s reason=not_found",
            pricing_id,
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except Exception:
        logger.exception(
            "Pricing update failed pricing_id=%s user_id=%s",
            pricing_id,
            current_user.id,
        )
        raise