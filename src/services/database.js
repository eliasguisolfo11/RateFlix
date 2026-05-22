import * as SQLite from 'expo-sqlite';

let db = null;

async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('rateflix.db');
  }
  return db;
}

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
    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      media_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      rating REAL DEFAULT 0,
      media_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'watchlist',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, media_id),
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      media_id INTEGER NOT NULL,
      media_type TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, media_id),
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    );
  `);
  try {
    await database.runAsync('ALTER TABLE users ADD COLUMN username TEXT DEFAULT ""');
  } catch (_) {}
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
    return { success: false, message: `Error al crear usuario: ${e.message}` };
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

export async function isFavorite(userEmail, mediaId) {
  const database = await getDb();
  const row = await database.getFirstAsync(
    'SELECT id FROM favorites WHERE user_email = ? AND media_id = ?',
    userEmail,
    mediaId
  );
  return !!row;
}

// ─── Watchlist ───────────────────────────────────────────

export async function addToWatchlist(userEmail, media) {
  const database = await getDb();
  try {
    await database.runAsync(
      `INSERT OR REPLACE INTO watchlist
       (user_email, media_id, title, poster_path, rating, media_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      userEmail,
      media.id,
      media.title || media.name,
      media.poster_path || '',
      media.vote_average || 0,
      media.media_type || 'movie',
      media.status || 'watchlist'
    );
    return true;
  } catch (e) {
    return false;
  }
}

export async function removeFromWatchlist(userEmail, mediaId) {
  const database = await getDb();
  await database.runAsync(
    'DELETE FROM watchlist WHERE user_email = ? AND media_id = ?',
    userEmail,
    mediaId
  );
}

export async function updateWatchlistStatus(userEmail, mediaId, status) {
  const database = await getDb();
  await database.runAsync(
    'UPDATE watchlist SET status = ? WHERE user_email = ? AND media_id = ?',
    status,
    userEmail,
    mediaId
  );
}

export async function getWatchlist(userEmail, status) {
  const database = await getDb();
  if (status) {
    return await database.getAllAsync(
      'SELECT * FROM watchlist WHERE user_email = ? AND status = ? ORDER BY created_at DESC',
      userEmail,
      status
    );
  }
  return await database.getAllAsync(
    'SELECT * FROM watchlist WHERE user_email = ? ORDER BY created_at DESC',
    userEmail
  );
}

export async function getWatchlistStatus(userEmail, mediaId) {
  const database = await getDb();
  const row = await database.getFirstAsync(
    'SELECT status FROM watchlist WHERE user_email = ? AND media_id = ?',
    userEmail,
    mediaId
  );
  return row?.status || null;
}

// ─── Ratings ─────────────────────────────────────────────

export async function setRating(userEmail, mediaId, mediaType, score) {
  const database = await getDb();
  try {
    await database.runAsync(
      `INSERT OR REPLACE INTO ratings
       (user_email, media_id, media_type, score)
       VALUES (?, ?, ?, ?)`,
      userEmail,
      mediaId,
      mediaType,
      score
    );
    return true;
  } catch (e) {
    return false;
  }
}

export async function removeRating(userEmail, mediaId) {
  const database = await getDb();
  await database.runAsync(
    'DELETE FROM ratings WHERE user_email = ? AND media_id = ?',
    userEmail,
    mediaId
  );
}

export async function getRating(userEmail, mediaId) {
  const database = await getDb();
  const row = await database.getFirstAsync(
    'SELECT score FROM ratings WHERE user_email = ? AND media_id = ?',
    userEmail,
    mediaId
  );
  return row?.score || 0;
}
