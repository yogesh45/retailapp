export type UploadStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "COMPLETED_WITH_ERRORS"
  | "FAILED";

export interface UploadResponse {
  upload_id: number;
  status: UploadStatus;
}

export interface UploadStatusResponse {
  upload_id: number;
  file_name: string;
  status: UploadStatus;
  total_rows: number;
  processed_rows: number;
  successful_rows: number;
  failed_rows: number;
  progress_percentage: number;
  error_message: string | null;
  uploaded_at: string;
  completed_at: string | null;
}