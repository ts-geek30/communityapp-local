export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

export const getAuthToken = (): string | null => {
  return localStorage.getItem('admin_access_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('admin_access_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_selected_community');
};

export const getSelectedCommunity = (): string | null => {
  return localStorage.getItem('admin_selected_community');
};

export const setSelectedCommunity = (communityId: string) => {
  localStorage.setItem('admin_selected_community', communityId);
};

interface RequestOptions {
  body?: any;
  headers?: Record<string, string>;
}

const makeRequest = async (endpoint: string, method: string, options: RequestOptions = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    removeAuthToken();
    window.location.reload();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const errorMsg = data.errors.map((e: any) => e.message).join(' | ');
      throw new Error(errorMsg);
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const apiGet = (endpoint: string) => makeRequest(endpoint, 'GET');
export const apiPost = (endpoint: string, body: any) => makeRequest(endpoint, 'POST', { body });
export const apiPut = (endpoint: string, body: any) => makeRequest(endpoint, 'PUT', { body });
export const apiDelete = (endpoint: string) => makeRequest(endpoint, 'DELETE');
