-- Dhaka Bus Navigator - local database schema
-- Works on MySQL 8+ and MariaDB (XAMPP/WAMP default).
-- Run with: mysql -u root -p < server/schema.sql

CREATE DATABASE IF NOT EXISTS dhaka_bus_navigator
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dhaka_bus_navigator;

DROP TABLE IF EXISTS fares;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS user_feedback;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS stops;

CREATE TABLE stops (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DOUBLE NULL,
  lng DOUBLE NULL,
  nearby_landmarks JSON NOT NULL
);

CREATE TABLE routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#2563eb',
  frequency VARCHAR(50) NULL,
  stops JSON NOT NULL
);

CREATE TABLE fares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  from_stop_id INT NOT NULL,
  to_stop_id INT NOT NULL,
  fare DECIMAL(6,2) NOT NULL,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

CREATE TABLE user_feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feedback_type VARCHAR(50) NOT NULL,
  stop_id VARCHAR(50) NULL,
  route_id VARCHAR(50) NULL,
  description TEXT NOT NULL,
  contact_email VARCHAR(100) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NULL,
  stop_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
