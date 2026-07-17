from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.enum import UploadStatus
from app.models.upload import PricingUpload


class UploadRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_upload(
        self,
        upload: PricingUpload,
    ) -> PricingUpload:
        self.db.add(upload)
        self.db.commit()
        self.db.refresh(upload)

        return upload

    def get_by_id(
        self,
        upload_id: int,
    ) -> PricingUpload | None:
        statement = select(PricingUpload).where(
            PricingUpload.id == upload_id
        )

        return self.db.scalar(statement)

    def update(
        self,
        upload: PricingUpload,
    ) -> PricingUpload:
        self.db.commit()
        self.db.refresh(upload)

        return upload

    def update_status(
        self,
        upload: PricingUpload,
        status: UploadStatus,
    ) -> PricingUpload:
        upload.status = status

        self.db.commit()
        self.db.refresh(upload)

        return upload

    def update_progress(
        self,
        upload: PricingUpload,
        processed_rows: int,
        successful_rows: int,
        failed_rows: int,
    ) -> PricingUpload:
        upload.processed_rows = processed_rows
        upload.successful_rows = successful_rows
        upload.failed_rows = failed_rows

        self.db.commit()
        self.db.refresh(upload)

        return upload