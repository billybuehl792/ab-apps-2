import { AxiosError } from "axios";

const getErrorMessage = (error: unknown): string => {
  let message = "An unknown error occurred";

  if (typeof error === "string") message = error;
  else if (error instanceof AxiosError)
    message = error.response?.data.detail ?? error.message;
  else if (error instanceof Error) message = error.message;

  return message;
};

export const errorUtils = { getErrorMessage };
