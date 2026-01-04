-- Example SQL schema: users & sessions
-- Compatible with many RDBMS (PostgreSQL/MySQL/SQLite) with minor tweaks

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed example users (adjust syntax per RDBMS)
-- INSERT INTO users (id, email, name) VALUES
-- ('1','alice@example.com','Alice'),
-- ('2','bob@example.com','Bob');