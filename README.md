# Smart Gym Assistant - React + Node.js + PostgreSQL

This is a beginner-friendly full-stack website with two views:

- User view: home, login, signup, dashboard, workout log
- Admin view: user management, exercise management

The frontend is built with React JavaScript.
The backend is built with Node.js and Express.
The database is PostgreSQL.

---

## 1. Install Node.js

Check if Node.js and npm are installed:

```bash
node -v
npm -v
```

If you get an error, install Node.js LTS from the official Node.js website.

---

## 2. Install PostgreSQL

Install PostgreSQL on your computer.
During installation, remember the password you set for the `postgres` user.

Example password used in this project:

```text
1234
```

If your PostgreSQL password is different, you must edit this file:

```text
server/.env
```

---

## 3. Create the database

Open pgAdmin or SQL Shell and run the SQL file:

```text
database/database.sql
```

Important:

First run:

```sql
DROP DATABASE IF EXISTS smart_gym_db;
CREATE DATABASE smart_gym_db;
```

Then connect to `smart_gym_db` and run the rest of the table code.

---

## 4. Setup the backend environment file

Go to the server folder:

```bash
cd server
```

Copy `.env.example` and rename it to `.env`.

Example `.env`:

```text
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=smart_gym_db
DB_PASSWORD=1234
DB_PORT=5432
```

---

## 5. Install project packages

From the main project folder, run:

```bash
npm install
npm run install-all
```

---

## 6. Run the project

From the main project folder, run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

Database test:

```text
http://localhost:5000/api/test-db
```

---

## Test accounts

User account:

```text
Email: rama@example.com
Password: 1234
```

Admin account:

```text
Email: admin@gym.com
Password: admin123
```

---

## Important note for assignment

The password is stored as plain text to keep the project simple for learning. In a real website, passwords should be hashed using bcrypt.

## Project Status

The Smart Gym Assistant project includes user pages, admin pages, backend APIs, and PostgreSQL database connection.