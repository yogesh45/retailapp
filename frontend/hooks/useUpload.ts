"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import uploadService from "@/services/upload.service";
import { UploadStatusResponse } from "@/types/upload";
import { getApiErrorMessage } from "@/utils/api-error";

interface UseUploadOptions {
  onCompleted?: () => void | Promise<void>;
}

export default function useUpload({
  onCompleted,
}: UseUploadOptions = {}) {
  const [uploadStatus, setUploadStatus] =
    useState<UploadStatusResponse | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const pollingTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  const hideTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const hideStatusAfterDelay = useCallback(() => {
    clearHideTimer();

    hideTimerRef.current = setTimeout(() => {
      setUploadStatus(null);
      setError("");
      hideTimerRef.current = null;
    }, 5000);
  }, [clearHideTimer]);

  const checkStatus = useCallback(
    async (uploadId: number) => {
      try {
        const status =
          await uploadService.getUploadStatus(
            uploadId
          );

        setUploadStatus(status);

        const completed =
          status.status === "COMPLETED" ||
          status.status ===
            "COMPLETED_WITH_ERRORS";

        if (completed) {
          stopPolling();
          setUploading(false);

          if (
            status.status ===
            "COMPLETED_WITH_ERRORS"
          ) {
            toast.success(
              `Upload completed with ${status.failed_rows} failed rows.`
            );
          } else {
            toast.success(
              "CSV processing completed."
            );
          }

          await onCompleted?.();

          hideStatusAfterDelay();
          return;
        }

        if (status.status === "FAILED") {
          stopPolling();
          setUploading(false);

          const message =
            status.error_message ??
            "CSV processing failed.";

          setError(message);
          toast.error(message);

          hideStatusAfterDelay();
        }
      } catch (requestError) {
        stopPolling();
        setUploading(false);

        const message = getApiErrorMessage(
          requestError,
          "Unable to retrieve upload status."
        );

        setError(message);
        toast.error(message);

        hideStatusAfterDelay();
      }
    },
    [
      hideStatusAfterDelay,
      onCompleted,
      stopPolling,
    ]
  );

  const startPolling = useCallback(
    (uploadId: number) => {
      stopPolling();

      void checkStatus(uploadId);

      pollingTimerRef.current = setInterval(() => {
        void checkStatus(uploadId);
      }, 1000);
    },
    [checkStatus, stopPolling]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      stopPolling();
      clearHideTimer();

      setUploading(true);
      setUploadStatus(null);
      setError("");

      try {
        const response =
          await uploadService.uploadFile(file);

        toast.success(
          "File uploaded. Processing started."
        );

        startPolling(response.upload_id);
      } catch (requestError) {
        setUploading(false);

        const message = getApiErrorMessage(
          requestError,
          "Unable to upload the CSV."
        );

        setError(message);
        toast.error(message);
      }
    },
    [
      clearHideTimer,
      startPolling,
      stopPolling,
    ]
  );

  const resetUpload = useCallback(() => {
    stopPolling();
    clearHideTimer();

    setUploading(false);
    setUploadStatus(null);
    setError("");
  }, [clearHideTimer, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
      clearHideTimer();
    };
  }, [clearHideTimer, stopPolling]);

  return {
    uploadStatus,
    uploading,
    error,
    uploadFile,
    resetUpload,
  };
}