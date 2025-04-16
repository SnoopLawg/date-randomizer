# Developer Documentation

## Project Setup

### Prerequisites

- Node.js (v20.11.0 or higher)
- Docker
- npm/yarn

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the required values:

```env
# Server Configuration
PORT=3002
VITE_API_URL=http://localhost:3002
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=date_randomizer
DB_HOST=localhost
DB_PORT=5433

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# External APIs
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_WEATHER_API_KEY=your-weather-api-key
```

### Installation

```bash
# Install dependencies
npm install

# Install development dependencies
npm install -D sequelize-cli
```

## Database Setup

### Using Docker

The project uses PostgreSQL in Docker. The database configuration is in `docker-compose.yml`.

```bash
# Start the database
docker-compose up -d

# Stop the database
docker-compose down

# View database logs
docker-compose logs -f
```

### Database Migrations

Migrations are handled using Sequelize CLI. Migration files are in `server/migrations/*.cjs`.

```bash
# Run migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Create a new migration
npx sequelize-cli migration:generate --name migration-name
```

### Database Schema

#### Users Table

```sql
Table "public.users"
    Column     |           Type           | Nullable | Default
---------------+--------------------------+----------+---------
 id            | integer                  | not null | serial
 username      | character varying(255)   | not null |
 email         | character varying(255)   | not null |
 password_hash | character varying(255)   | not null |
 first_name    | character varying(255)   |          |
 last_name     | character varying(255)   |          |
 is_active     | boolean                  |          | true
 last_login    | timestamp with time zone |          |
 created_at    | timestamp with time zone | not null |
 updated_at    | timestamp with time zone | not null |
Indexes:
    "users_pkey" PRIMARY KEY (id)
    "users_email_key" UNIQUE
    "users_username_key" UNIQUE
```

#### Date Events Table

```sql
Table "public.date_events"
   Column    |           Type           | Nullable | Default
-------------+--------------------------+----------+---------
 id          | integer                  | not null | serial
 title       | character varying(255)   | not null |
 description | text                     |          |
 location    | character varying(255)   |          |
 date        | timestamp with time zone | not null |
 weather     | json                     |          |
 coordinates | json                     |          |
 user_id     | integer                  | not null |
 created_at  | timestamp with time zone | not null |
 updated_at  | timestamp with time zone | not null |
Foreign-key constraints:
    "date_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
```

## Project Structure

```
server/
├── config/           # Configuration files
│   ├── database.js   # Database configuration
│   └── config.json   # Sequelize config
├── middleware/       # Express middleware
│   └── auth.js       # Authentication middleware
├── models/          # Sequelize models
│   ├── index.js     # Model associations
│   ├── User.js      # User model
│   └── DateEvent.js # DateEvent model
├── routes/          # API routes
│   ├── auth.js      # Authentication routes
│   └── dates.js     # Date-related routes
├── services/        # Business logic
│   ├── auth.js      # Authentication service
│   └── dates.js     # Date service
├── utils/           # Utility functions
│   └── validators.js # Request validators
└── index.js         # Server entry point
```

## API Endpoints

### Authentication

```bash
# Register a new user
POST /api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "first_name": "Test",
  "last_name": "User"
}

# Login
POST /api/auth/login
{
  "username": "testuser",
  "password": "password123"
}

# Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>

# Logout
POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

### Date Events

```bash
# Create a date event
POST /api/dates
Headers: Authorization: Bearer <token>
{
  "title": "Dinner Date",
  "description": "Nice dinner at a restaurant",
  "location": "123 Main St",
  "date": "2024-04-20T18:00:00Z"
}

# Get all dates for current user
GET /api/dates
Headers: Authorization: Bearer <token>
```

## Development Workflow

### Code Style

- Use ES6+ features
- Follow ESLint configuration
- Use async/await for asynchronous operations
- Use proper error handling with try/catch

### Authentication

- JWT tokens are used for authentication
- Tokens expire after 7 days
- Protected routes require the `auth` middleware
- Passwords are hashed using bcrypt

### Database Operations

- Use Sequelize models for database operations
- Follow migrations for schema changes
- Use transactions for complex operations
- Add appropriate indexes for performance

### Error Handling

- Use proper HTTP status codes
- Return consistent error responses
- Log errors appropriately
- Validate input data using express-validator

## Common Issues and Solutions

### Port Conflicts

If port 5432 is already in use (common with local PostgreSQL):

1. Change the port in docker-compose.yml
2. Update DB_PORT in .env
3. Update config/config.json

### Migration Issues

If migrations fail:

1. Check file extensions (.cjs for CommonJS)
2. Ensure database is running
3. Check connection settings
4. Run migrations with --debug flag

### Authentication Issues

1. Check JWT_SECRET in .env
2. Verify token format (Bearer <token>)
3. Check token expiration
4. Verify user is_active status
