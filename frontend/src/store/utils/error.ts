import { AxiosError } from "axios";

const getErrorMessage = (error: unknown): string => {
  let message = "An unknown error occurred";

  if (typeof error === "string") message = error;
  else if (error instanceof AxiosError)
    message = error.response?.data.detail ?? error.message;
  else if (error instanceof Error) message = error.message;

  return message;
};

const isInvalidPageError = (error: unknown): boolean => {
  const isAxiosError = error instanceof AxiosError;
  if (!isAxiosError) return false;

  return error.response?.data.detail.toLowerCase().includes("invalid page");
};

export const errorUtils = { getErrorMessage, isInvalidPageError };
