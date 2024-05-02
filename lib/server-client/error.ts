import { AxiosError } from "axios";
import { ErrorResponse } from "./types";

export class ServerError extends Error {
  status: number;

  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
  }
}

export function mapServerError(error: AxiosError) {
  if (error.response == undefined) {
    return new ServerError(error.message, parseInt(error.code ?? "500"));
  }

  const response = error.response.data as ErrorResponse;

  throw new ServerError(
    response.message,
    response.status,
  )
}
