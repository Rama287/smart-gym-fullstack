DROP DATABASE IF EXISTS smart_gym_db;
CREATE DATABASE smart_gym_db;

-- After creating the database, connect to smart_gym_db and run the code below.

DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  calories INTEGER NOT NULL
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise VARCHAR(100) NOT NULL,
  duration INTEGER NOT NULL,
  calories INTEGER NOT NULL,
  workout_date DATE NOT NULL
);

INSERT INTO users (name, email, password, role, status) VALUES
('Rama', 'rama@example.com', '1234', 'user', 'Active'),
('Admin', 'admin@gym.com', 'admin123', 'admin', 'Active');

INSERT INTO exercises (name, category, level, calories) VALUES
('Treadmill Running', 'Cardio', 'Beginner', 250),
('Squats', 'Strength', 'Intermediate', 180),
('Push Ups', 'Strength', 'Beginner', 100),
('Cycling', 'Cardio', 'Beginner', 220);

INSERT INTO workouts (user_id, exercise, duration, calories, workout_date) VALUES
(1, 'Treadmill Running', 30, 250, '2026-06-01'),
(1, 'Squats', 20, 180, '2026-06-02');
