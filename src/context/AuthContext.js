// Contexto global de autenticación
// Provee estado de login, usuario actual y funciones signIn/register/signOut
// Se inicializa la base de datos SQLite al montar el provider
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

  // Autentica usuario contra SQLite, setea estado global si es válido
  const signIn = async (email, password) => {
    const found = await findUser(email, password);
    if (found) {
      setUser(found);
      setIsLoggedIn(true);
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  };

  // Registra un nuevo usuario en SQLite sin auto-loguear
  const register = async (username, email, password) => {
    return await createUser(username, email, password);
  };

  // Cierra sesión y limpia el estado
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

// Hook personalizado para acceder al contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
