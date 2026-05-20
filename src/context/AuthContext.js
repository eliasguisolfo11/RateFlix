import React, { createContext, useState, useContext, useEffect } from 'react';
import { findUser, createUser, initDatabase } from '../services/database';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setReady(true));
  }, []);

  const signIn = async (email, password) => {
    const found = await findUser(email, password);
    if (found) {
      setUser(found);
      setIsLoggedIn(true);
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  };

  const register = async (username, email, password) => {
    return await createUser(username, email, password);
  };

  const signOut = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, ready, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
