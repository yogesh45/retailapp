"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalRecords: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalRecords,
  loading,
  onPageChange,
}: PaginationProps) {
  if (totalRecords === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Page {page} of {totalPages} ·{" "}
        {totalRecords} records
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="rounded-lg border text-slate-600 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="rounded-lg text-slate-600 bg-slate-100 px-4 py-2 text-sm font-medium">
          {page}
        </span>

        <button
          type="button"
          disabled={
            page >= totalPages || loading
          }
          onClick={() =>
            onPageChange(page + 1)
          }
          className="rounded-lg text-slate-600 border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}   