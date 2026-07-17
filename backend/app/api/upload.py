import logging

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
    BackgroundTasks
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User
from app.schemas.upload import UploadResponse, UploadStatusResponse
from app.services.upload_services import UploadService


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/uploads",
    tags=["Uploads"],
)


@router.post(
    "",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_pricing_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> UploadResponse:

    logger.info(
        "CSV upload request filename=%s user_id=%s",
        file.filename,
        current_user.id,
    )

    if not file.filename.endswith(".csv"):
        logger.warning(
            "Invalid file uploaded filename=%s",
            file.filename,
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are allowed.",
        )

    service = UploadService(db)

    try:
        response = service.create_upload(
            file=file,
            current_user=current_user,
            background_tasks=background_tasks,
        )

        logger.info(
            "Upload created upload_id=%s",
            response.upload_id,
        )

        return response

    except Exception:
        logger.exception(
            "Upload failed filename=%s",
            file.filename,
        )
        raise

@router.get(
    "/{upload_id}/status",
    response_model=UploadStatusResponse,
)
def get_upload_status(
    upload_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    service = UploadService(db)

    return service.get_upload_status(upload_id)