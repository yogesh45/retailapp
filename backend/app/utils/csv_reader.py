import csv
from collections.abc import Generator
from pathlib import Path


class CSVReader:
    @staticmethod
    def validate_headers(
        file_path: str,
        required_columns: set[str],
    ) -> None:
        with Path(file_path).open(
            mode="r",
            encoding="utf-8-sig",
            newline="",
        ) as file:
            reader = csv.DictReader(file)

            if reader.fieldnames is None:
                raise ValueError("CSV header is missing")

            actual_columns = {
                column.strip()
                for column in reader.fieldnames
            }

            missing_columns = (
                required_columns - actual_columns
            )

            if missing_columns:
                missing = ", ".join(
                    sorted(missing_columns)
                )

                raise ValueError(
                    f"Missing required CSV columns: {missing}"
                )

    @staticmethod
    def count_rows(
        file_path: str,
    ) -> int:
        with Path(file_path).open(
            mode="r",
            encoding="utf-8-sig",
            newline="",
        ) as file:
            reader = csv.DictReader(file)
            return sum(1 for _ in reader)

    @staticmethod
    def read_in_batches(
        file_path: str,
        batch_size: int,
    ) -> Generator[list[dict[str, str]], None, None]:
        if batch_size <= 0:
            raise ValueError(
                "Batch size must be greater than zero"
            )

        with Path(file_path).open(
            mode="r",
            encoding="utf-8-sig",
            newline="",
        ) as file:
            reader = csv.DictReader(file)
            batch: list[dict[str, str]] = []

            for row in reader:
                batch.append(row)

                if len(batch) == batch_size:
                    yield batch
                    batch = []

            if batch:
                yield batch