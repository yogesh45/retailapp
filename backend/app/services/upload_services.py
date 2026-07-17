import logging
from pathlib import Path
from shutil import copyfileobj
from uuid import uuid4

from fastapi import UploadFile, BackgroundTasks
from sqlalchemy.orm import Session

from app.models.enum import UploadStatus
from app.models.upload import PricingUpload
from app.models.user import User
from app.repositories.upload_repository import UploadRepository
from app.schemas.upload import UploadResponse, UploadStatusResponse
from app.utils.csv_processor import CSVProcessor
from app.core.config import get_settings

logger = logging.getLogger(__name__)

app_settings = get_settings()


class UploadService:



    def __init__(self, db: Session):
        self.repository = UploadRepository(db)

    def create_upload(
        self,
        file: UploadFile,
        current_user: User,
        background_tasks: BackgroundTasks
    ) -> UploadResponse:

        logger.info(
            "Upload started filename=%s user_id=%s",
            file.filename,
            current_user.id,
        )

        # Create uploads directory if it doesn't exist
        upload_directory = Path(
            app_settings.upload_directory
        )
        upload_directory.mkdir(exist_ok=True)

        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid4()}{file_extension}"

        file_path = upload_directory / unique_filename

        # Save uploaded file
        with file_path.open("wb") as buffer:
            copyfileobj(file.file, buffer)

        logger.info(
            "File saved path=%s",
            file_path,
        )

        upload = PricingUpload(
            file_name=unique_filename,
            status=UploadStatus.PENDING,
            uploaded_by=current_user.id,
        )

        upload = self.repository.create_upload(upload)

        background_tasks.add_task(
            CSVProcessor.process_upload,
            upload.id,
        )

        logger.info(
            "Upload job created upload_id=%s",
            upload.id,
        )

        return UploadResponse(
            upload_id=upload.id,
            status=upload.status,
        )
    
    def get_upload_status(
        self,
        upload_id: int,
    ) -> UploadStatusResponse:
        upload = self.repository.get_by_id(upload_id)

        if upload is None:
            raise ValueError("Upload not found")

        progress = 0.0

        if upload.total_rows > 0:
            progress = round(
                (
                    upload.processed_rows
                    / upload.total_rows
                )
                * 100,
                2,
            )

        return UploadStatusResponse(
            upload_id=upload.id,
            file_name=upload.file_name,
            status=upload.status,
            total_rows=upload.total_rows,
            processed_rows=upload.processed_rows,
            successful_rows=upload.successful_rows,
            failed_rows=upload.failed_rows,
            progress_percentage=progress,
            error_message=upload.error_message,
            uploaded_at=upload.uploaded_at,
            completed_at=upload.completed_at,
        )