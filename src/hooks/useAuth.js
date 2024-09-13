import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Здесь можно добавить проверку токена или запрос данных пользователя с сервера
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};

export default useAuth;
