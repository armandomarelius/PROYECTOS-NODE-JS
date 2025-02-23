import { createContext, useState, useEffect, useContext } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/check-auth`, {
        method: 'GET',
        credentials: 'include' // Armando recuerda pa enviar cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.userId) {
          // como esto me devuelve los datos de usuario los almaceno jeje
          const userResponse = await fetch(`${BACKEND_URL}/api/users/me`, {
            method: 'GET',
            credentials: 'include'
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          }
        }
      }
    } catch (err) {
      console.error('Error al verificar autenticación:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (username, password) => {
    try {
      setError(null);
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Importante para recibir las cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (username, password) => {
    try {
      setError(null);
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al cerrar sesión');
      }
      
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user, // lo convierte a booleano tusabe
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// exportamos el contexto como un Hook.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro del proveedor AuthProvider");
  }
  return context;
};

