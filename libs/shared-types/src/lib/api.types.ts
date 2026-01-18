export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
  requestId?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  requestId?: string;
  memory?: {
    used: number;
    total: number;
  };
  services?: {
    database?: 'healthy' | 'unhealthy' | 'not_implemented';
    cache?: 'healthy' | 'unhealthy' | 'not_implemented';
    external_apis?: 'healthy' | 'unhealthy' | 'not_implemented';
  };
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
