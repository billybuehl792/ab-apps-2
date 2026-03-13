import { AxiosError } from "axios";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      if (typeof error.response?.data === "string") return error.response.data;
      if (typeof error.response?.data.detail === "string")
        return error.response.data.detail;
      if (Array.isArray(error.response?.data))
        return error.response.data.join(" ");
    }
  }
  if (error instanceof Error) return error.message;

  return "An unknown error occurred";
};

const isInvalidPageError = (error: unknown): boolean => {
  const isAxiosError = error instanceof AxiosError;
  if (!isAxiosError) return false;

  return error.response?.data.detail.toLowerCase().includes("invalid page");
};

export const errorUtils = { getErrorMessage, isInvalidPageError };
