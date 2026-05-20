// Módulo de persistencia local con SQLite (expo-sqlite)
// Almacena usuarios y favoritos de forma permanente en el dispositivo
import * as SQLite from 'expo-sqlite';

let db = null;

// Retorna la conexión a la base de datos, creándola si es la primera vez
async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('rateflix.db');
  }
  return db;
}

// Inicializa las tablas y el usuario por defecto (admin/123)
// Se ejecuta una sola vez al arrancar la aplicación
export async function initDatabase() {
  const database = await getDb();
  await database.execAsync('PRAGMA foreign_keys = ON;');
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      media_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      rating REAL DEFAULT 0,
      media_type TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, media_id),
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    );
  `);
  const existing = await database.getFirstAsync('SELECT id FROM users WHERE email = ?', 'admin');
  if (!existing) {
    await database.runAsync(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      'admin',
      'admin',
      '123'
    );
  }
}

// Crea un nuevo usuario en la base de datos
// Retorna { success: true } o { success: false, message }
export async function createUser(username, email, password) {
  const database = await getDb();
  try {
    await database.runAsync(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      username,
      email,
      password
    );
    return { success: true };
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      return { success: false, message: 'El email ya está registrado' };
    }
    return { success: false, message: 'Error al crear usuario' };
  }
}

// Busca un usuario por email y contraseña para autenticación
// Retorna el usuario o null si no coincide
export async function findUser(email, password) {
  const database = await getDb();
  const user = await database.getFirstAsync(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    email,
    password
  );
  return user || null;
}

// Agrega un favorito para el usuario, o lo reemplaza si ya existe
// @param {string} userEmail - Email del usuario
// @param {object} media - Objeto con id, title, poster_path, vote_average, media_type
export async function addFavorite(userEmail, media) {
  const database = await getDb();
  try {
    await database.runAsync(
      `INSERT OR REPLACE INTO favorites (user_email, media_id, title, poster_path, rating, media_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      userEmail,
      media.id,
      media.title || media.name,
      media.poster_path || '',
      media.vote_average || 0,
      media.media_type || 'movie'
    );
    return true;
  } catch (e) {
    return false;
  }
}

// Elimina un favorito específico del usuario
export async function removeFavorite(userEmail, mediaId) {
  const database = await getDb();
  await database.runAsync(
    'DELETE FROM favorites WHERE user_email = ? AND media_id = ?',
    userEmail,
    mediaId
  );
}

// Obtiene todos los favoritos de un usuario, ordenados del más reciente al más antiguo
export async function getFavorites(userEmail) {
  const database = await getDb();
  const rows = await database.getAllAsync(
    'SELECT * FROM favorites WHERE user_email = ? ORDER BY created_at DESC',
    userEmail
  );
  return rows;
}

// Verifica si un contenido ya está marcado como favorito por el usuario
// Retorna true/false
export async function isFavorite(userEmail, mediaId) {
  const database = await getDb();
  const row = await database.getFirstAsync(
    'SELECT id FROM favorites WHERE user_email = ? AND media_id = ?',
    userEmail,
    mediaId
  );
  return !!row;
}
