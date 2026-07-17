"use client";

import { UploadStatusResponse } from "@/types/upload";

interface UploadProgressProps {
  status: UploadStatusResponse | null;
}

function getStatusLabel(
  status: UploadStatusResponse["status"]
) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "PROCESSING":
      return "Processing";

    case "COMPLETED":
      return "Completed";

    case "COMPLETED_WITH_ERRORS":
      return "Completed with errors";

    case "FAILED":
      return "Failed";
  }
}

export default function UploadProgress({
  status,
}: UploadProgressProps) {
  if (!status) {
    return null;
  }

  const progress = Math.min(
    Math.max(
      status.progress_percentage,
      0
    ),
    100
  );

  return (
    <section className="mt-4 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            CSV Processing
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {status.file_name}
          </p>
        </div>

        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {getStatusLabel(status.status)}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-600">
            {status.processed_rows} of{" "}
            {status.total_rows} records
          </span>

          <span className="font-semibold text-slate-900">
            {progress.toFixed(0)}%
          </span>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <ProgressMetric
          label="Total"
          value={status.total_rows}
        />

        <ProgressMetric
          label="Processed"
          value={status.processed_rows}
        />

        <ProgressMetric
          label="Successful"
          value={status.successful_rows}
        />

        <ProgressMetric
          label="Failed"
          value={status.failed_rows}
        />
      </div>

      {status.error_message && (
        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {status.error_message}
        </div>
      )}
    </section>
  );
}

interface ProgressMetricProps {
  label: string;
  value: number;
}

function ProgressMetric({
  label,
  value,
}: ProgressMetricProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}