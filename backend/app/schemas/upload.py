from datetime import datetime

from pydantic import BaseModel

from app.models.enum import UploadStatus


class UploadResponse(BaseModel):
    upload_id: int
    status: UploadStatus

    model_config = {
        "from_attributes": True,
    }


class UploadStatusResponse(BaseModel):
    upload_id: int
    file_name: str
    status: UploadStatus
    total_rows: int
    processed_rows: int
    successful_rows: int
    failed_rows: int
    progress_percentage: float
    error_message: str | None
    uploaded_at: datetime
    completed_at: datetime | None
    model_config = {
        "from_attributes": True,
    }