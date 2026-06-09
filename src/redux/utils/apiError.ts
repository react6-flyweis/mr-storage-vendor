import type { ApiResponse } from "../api/apiResponse";

export const getApiErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "data" in error) {
    const responseData = error as { data?: ApiResponse | string };
    const responseMessage = responseData.data;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (
      responseMessage &&
      typeof responseMessage === "object" &&
      "message" in responseMessage &&
      typeof responseMessage.message === "string"
    ) {
      return responseMessage.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown Error occurred.";
};
