const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const fetchWithAuth = async (endpoint, options = {}) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = usuario?.token;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Ocurrió un error');
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error en fetchWithAuth:', error);
    throw error;
  }
};

export default fetchWithAuth;
