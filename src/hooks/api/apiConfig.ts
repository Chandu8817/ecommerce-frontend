const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  token: any;
  items(items: any): unknown;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const apiRequest = async <T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle request body for non-GET requests
  let body = options.body;
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    body = JSON.stringify(options.body);
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseData.message || 'Something went wrong');
  }

  return responseData;
};

// Helper function for GET requests
export const apiGet = <T = any>(endpoint: string, queryParams: Record<string, any> = {}) => {
  const queryString = new URLSearchParams();
  
  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => queryString.append(key, String(item)));
    } else if (value !== undefined && value !== null) {
      queryString.append(key, String(value));
    }
  });
  
  const url = queryString.toString() ? `${endpoint}?${queryString}` : endpoint;
  return apiRequest<T>(url);
};

// Helper function for POST requests
export const apiPost = <T = any>(
  endpoint: string, 
  data: any, 
  headers: HeadersInit = {}
) => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data,
    headers,
  });
};

// Helper function for PUT requests
export const apiPut = <T = any>(endpoint: string, data: any) => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data,
  });
};

// Helper function for DELETE requests
export const apiDelete = <T = any>(endpoint: string) => {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
};

// Helper function for PATCH requests
export const apiPatch = <T = any>(endpoint: string, data: any) => {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data,
  });
};
