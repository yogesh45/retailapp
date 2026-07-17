import axios from "axios";

type ValidationErrorItem = {
  type?: string;
  loc?: Array<string | number>;
  msg?: string;
  input?: unknown;
};

type ApiErrorData = {
  detail?:
    | string
    | ValidationErrorItem
    | ValidationErrorItem[];
  message?: string;
};

function formatValidationError(
  item: ValidationErrorItem
): string {
  const location = Array.isArray(item.loc)
    ? item.loc.map(String).join(" → ")
    : "";

  if (location && item.msg) {
    return `${location}: ${item.msg}`;
  }

  return item.msg ?? "Validation failed";
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (!axios.isAxiosError<ApiErrorData>(error)) {
    return fallback;
  }

  const data = error.response?.data;
  const detail = data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map(formatValidationError)
      .join(", ");
  }

  if (
    detail &&
    typeof detail === "object"
  ) {
    return formatValidationError(detail);
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallback;
}