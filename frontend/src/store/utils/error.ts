import { AxiosError } from "axios";

const getErrorMessage = (error: unknown): string => {
  let errorMessage = "";

  if (typeof error === "string") errorMessage = error;
  else if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (typeof data === "string") errorMessage = data;
    else if (typeof data?.detail === "string") errorMessage = data.detail;
    else if (Array.isArray(data)) errorMessage = data.join(" ");
    else if (data && typeof data === "object") {
      errorMessage = Object.values(data)
        .flatMap((value) =>
          Array.isArray(value)
            ? value
            : typeof value === "string"
              ? [value]
              : [],
        )
        .join(" ");
    }
  } else if (error instanceof Error) errorMessage = error.message;

  return errorMessage.slice(0, 200) || "An unknown error occurred";
};

const isInvalidPageError = (error: unknown): boolean => {
  const isAxiosError = error instanceof AxiosError;
  if (!isAxiosError) return false;

  return error.response?.data.detail.toLowerCase().includes("invalid page");
};

export const errorUtils = { getErrorMessage, isInvalidPageError };
