import { AxiosError } from "axios";

const getErrorMessage = (error: unknown): string => {
  let errorMessage = "";

  if (typeof error === "string") errorMessage = error;
  else if (error instanceof AxiosError) {
    if (error.response?.data) {
      if (typeof error.response?.data === "string")
        errorMessage = error.response.data;
      else if (typeof error.response?.data.detail === "string")
        errorMessage = error.response.data.detail;
      else if (Array.isArray(error.response?.data))
        errorMessage = error.response.data.join(" ");
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
