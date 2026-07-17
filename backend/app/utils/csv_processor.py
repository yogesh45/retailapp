import logging
from datetime import date, datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path

from app.core.database import SessionLocal
from app.models.enum import UploadStatus
from app.repositories.pricing_repository import PricingRepository
from app.repositories.upload_repository import UploadRepository
from app.utils.csv_reader import CSVReader


logger = logging.getLogger(__name__)

BATCH_SIZE = 100

REQUIRED_COLUMNS = {
    "store_id",
    "sku",
    "product_name",
    "price",
    "pricing_date",
}


class CSVProcessor:
    @staticmethod
    def process_upload(upload_id: int) -> None:
        db = SessionLocal()

        try:
            upload_repository = UploadRepository(db)
            pricing_repository = PricingRepository(db)

            upload = upload_repository.get_by_id(upload_id)

            if upload is None:
                logger.error(
                    "CSV processing stopped upload_id=%s reason=upload_not_found",
                    upload_id,
                )
                return

            file_path = Path("uploads") / upload.file_name

            if not file_path.exists():
                raise FileNotFoundError(
                    f"Uploaded file does not exist: {file_path}"
                )

            logger.info(
                "CSV processing started upload_id=%s file=%s",
                upload_id,
                upload.file_name,
            )

            upload.status = UploadStatus.PROCESSING
            upload.error_message = None
            db.commit()

            CSVReader.validate_headers(
                file_path=str(file_path),
                required_columns=REQUIRED_COLUMNS,
            )

            upload.total_rows = CSVReader.count_rows(
                str(file_path)
            )
            db.commit()

            processed_rows = 0
            successful_rows = 0
            failed_rows = 0

            for batch in CSVReader.read_in_batches(
                file_path=str(file_path),
                batch_size=BATCH_SIZE,
            ):
                for row in batch:
                    row_number = processed_rows + 2

                    try:
                        parsed_row = CSVProcessor._validate_row(
                            row=row,
                            row_number=row_number,
                        )

                        pricing_repository.upsert_from_csv(
                            store_id=parsed_row["store_id"],
                            sku=parsed_row["sku"],
                            product_name=parsed_row["product_name"],
                            price=parsed_row["price"],
                            pricing_date=parsed_row["pricing_date"],
                            user_id=upload.uploaded_by,
                        )

                        successful_rows += 1

                    except Exception as row_error:
                        failed_rows += 1

                        logger.warning(
                            (
                                "CSV row failed upload_id=%s "
                                "row_number=%s error=%s"
                            ),
                            upload_id,
                            row_number,
                            str(row_error),
                        )

                    finally:
                        processed_rows += 1

                upload.processed_rows = processed_rows
                upload.successful_rows = successful_rows
                upload.failed_rows = failed_rows

                db.commit()

                logger.info(
                    (
                        "CSV batch committed upload_id=%s "
                        "processed=%s total=%s successful=%s failed=%s"
                    ),
                    upload_id,
                    processed_rows,
                    upload.total_rows,
                    successful_rows,
                    failed_rows,
                )

            upload.status = (
                UploadStatus.COMPLETED_WITH_ERRORS
                if failed_rows > 0
                else UploadStatus.COMPLETED
            )
            upload.completed_at = datetime.now(timezone.utc)

            db.commit()

            logger.info(
                (
                    "CSV processing completed upload_id=%s "
                    "total=%s successful=%s failed=%s"
                ),
                upload_id,
                upload.total_rows,
                successful_rows,
                failed_rows,
            )

        except Exception as error:
            db.rollback()

            logger.exception(
                "CSV processing failed upload_id=%s",
                upload_id,
            )

            upload_repository = UploadRepository(db)
            upload = upload_repository.get_by_id(upload_id)

            if upload:
                upload.status = UploadStatus.FAILED
                upload.error_message = str(error)
                upload.completed_at = datetime.now(timezone.utc)
                db.commit()

        finally:
            db.close()

    @staticmethod
    def _validate_row(
        row: dict[str, str],
        row_number: int,
    ) -> dict:
        store_id = (row.get("store_id") or "").strip()
        sku = (row.get("sku") or "").strip()
        product_name = (row.get("product_name") or "").strip()
        raw_price = (row.get("price") or "").strip()
        raw_pricing_date = (
            row.get("pricing_date") or ""
        ).strip()

        if not store_id:
            raise ValueError(
                f"Store ID is required at row {row_number}"
            )

        if not sku:
            raise ValueError(
                f"SKU is required at row {row_number}"
            )

        if not product_name:
            raise ValueError(
                f"Product name is required at row {row_number}"
            )

        try:
            price = Decimal(raw_price)
        except InvalidOperation as exc:
            raise ValueError(
                f"Invalid price at row {row_number}"
            ) from exc

        if price <= 0:
            raise ValueError(
                f"Price must be greater than zero at row {row_number}"
            )

        try:
            pricing_date = date.fromisoformat(
                raw_pricing_date
            )
        except ValueError as exc:
            raise ValueError(
                (
                    f"Invalid pricing date at row {row_number}. "
                    "Expected YYYY-MM-DD"
                )
            ) from exc

        return {
            "store_id": store_id,
            "sku": sku,
            "product_name": product_name,
            "price": price,
            "pricing_date": pricing_date,
        }