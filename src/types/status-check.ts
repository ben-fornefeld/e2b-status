export type StatusCheck = {
  id: string;
  response_time_ms: number;
  success: boolean;
  http_status: number;
  error_message: string | null;
  timestamp: string;
};
