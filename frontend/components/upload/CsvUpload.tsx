"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

interface CsvUploadProps {
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
}

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

export default function CsvUpload({
  uploading,
  onUpload,
}: CsvUploadProps) {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const inputRef =
    useRef<HTMLInputElement | null>(null);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      !file.name.toLowerCase().endsWith(".csv")
    ) {
      toast.error(
        "Please choose a CSV file."
      );

      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "The CSV file must be smaller than 10 MB."
      );

      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      toast.error(
        "Please choose a CSV file."
      );
      return;
    }

    try {
      await onUpload(selectedFile);

      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      // useUpload displays the API error.
    }
  }

  return (
    <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900">
            Upload Pricing CSV
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Required columns: store_id, sku,
            product_name, price and
            pricing_date.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            disabled={uploading}
            onChange={handleFileChange}
            className="mt-5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium file:text-slate-700 hover:file:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {selectedFile && (
            <div className="mt-3 rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <p className="font-medium text-slate-700">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-slate-500">
                {(
                  selectedFile.size /
                  1024
                ).toFixed(1)}{" "}
                KB
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={
            uploading || !selectedFile
          }
          onClick={handleUpload}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "Processing..."
            : "Upload CSV"}
        </button>
      </div>
    </section>
  );
}