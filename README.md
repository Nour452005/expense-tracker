# Tracker — Expense Tracker

A full-stack expense tracking web application with JWT authentication, built as internship preparation.

![Dashboard Preview](https://i.imgur.com/placeholder.png)

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Frontend | Vanilla HTML/CSS/JS |

## Features

- User registration and login with secure password hashing
- JWT-protected API endpoints
- Add, edit, and delete expenses
- Filter expenses by category
- Monthly spending summary with live total
- Spending breakdown chart by category
- Clean, responsive dark UI

## Project Structure
expense-tracker/

├── index.js                  # Entry point

├── src/

│   ├── db.js                 # PostgreSQL connection pool

│   ├── middleware/

│   │   └── auth.js           # JWT verification middleware

│   ├── routes/

│   │   ├── authRoutes.js     # /auth endpoints

│   │   └── expenseRoutes.js  # /expenses endpoints

│   └── controllers/

│       ├── authController.js

│       └── expenseController.js

└── public/

├── index.html            # Login / Register page

├── dashboard.html        # Main app

├── style.css

└── app.js

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /auth/register | Create account | No |
| POST | /auth/login | Login, returns JWT | No |

### Expenses
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /expenses | Get all expenses | Yes |
| POST | /expenses | Add expense | Yes |
| PUT | /expenses/:id | Update expense | Yes |
| DELETE | /expenses/:id | Delete expense | Yes |
| GET | /expenses/summary | Monthly total + by category | Yes |

### Authentication
All protected routes require this header:
Authorization: Bearer <your_jwt_token>

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL

### Steps

1. Clone the repository
```bash
git clone https://github.com/Nour452005/expense-tracker.git
cd expense-tracker
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root
DB_HOST=localhost

DB_PORT=5432

DB_NAME=expense_tracker

DB_USER=postgres

DB_PASSWORD=your_password

PORT=3000

JWT_SECRET=your_long_random_secret

4. Create the database
```sql
CREATE DATABASE expense_tracker;
```

5. Create the tables
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

6. Start the server
```bash
npm run dev
```

7. Open your browser at `http://localhost:3000`

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- All expense queries are scoped to the authenticated user
- Parameterized queries prevent SQL injection
- `.env` is never committed to version control

## Author

Nour — Computer Engineering Student, Antonine University  

