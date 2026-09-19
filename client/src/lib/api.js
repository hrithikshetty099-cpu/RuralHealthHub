const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem('rhh_auth_token');
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    const error = new Error('The health server is offline.');
    error.code = 'NETWORK_ERROR';
    throw error;
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return body;
};

export const websocketUrl = () => {
  const apiUrl = API_URL.replace(/^http/, 'ws').replace(/\/api$/, '');
  return `${apiUrl}/ws`;
};