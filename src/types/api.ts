/** Backend success envelope */
export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: ApiPagination;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: unknown[];
}
