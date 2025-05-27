import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);  // ensures load only happens once

  const isAuthenticated = !!token;

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync('authToken');
      if (storedToken) setToken(storedToken);
      setTokenLoaded(true);
    };
    loadToken();
  }, []);

  const login = async (newToken) => {
    await SecureStore.setItemAsync('authToken', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        tokenLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
