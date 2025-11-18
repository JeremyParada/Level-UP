const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const fetchWithAuth = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

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
      // Si el token es inválido o expiró, desloguear al usuario
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('user');
        window.location.href = '/login'; 
      }
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Ocurrió un error');
    }
    
    // Si la respuesta no tiene contenido (ej. 204 No Content)
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
