# Retail Pricing Management System

## Overview

Retail Pricing Management System is a full-stack web application built using Next.js, FastAPI, and PostgreSQL. It enables retail organizations to manage product pricing efficiently through secure authentication, pricing search, inline price updates, and bulk CSV uploads with real-time processing progress.

The application follows a layered architecture using the Repository and Service patterns to ensure maintainability and scalability.

---

## Features

### Authentication

- JWT Authentication
- Role-Based Access Control (Admin and Viewer)
- Protected API endpoints
- Protected frontend routes

### Pricing Management

- Search pricing by Store ID, SKU, and Product Name
- Server-side pagination
- Update product pricing
- Automatic dashboard refresh after updates

### CSV Upload

- Upload pricing information using CSV files
- Validate required columns
- Background processing
- Chunk-based database updates
- Upload progress tracking
- Error handling

### Upload Progress

- Processing status
- Progress percentage
- Processed records
- Successful records
- Failed records
- Automatic refresh after completion

---

## Architecture

```
                    Next.js

                Authentication

                       │

                       ▼

                 Axios Client

                       │

                       ▼

               FastAPI REST APIs

                       │

                       ▼

                 Service Layer

                       │

                       ▼

              Repository Pattern

                       │

                       ▼

                  PostgreSQL
```

---

## CSV Processing Flow

```
CSV Upload

    │

    ▼

Save File

    │

    ▼

Create Upload Record

    │

    ▼

Background Task

    │

    ▼

CSV Generator

    │

    ▼

Chunk Processing

    │

    ▼

Database Upsert

    │

    ▼

Update Upload Status

    │

    ▼

Frontend Polling

    │

    ▼

Progress Bar
```

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- React Hot Toast

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic

### Development Tools

- Docker
- Git
- Swagger UI
- Uvicorn

---

## Project Structure

```
retail-pricing-system
│
├── backend
│   ├── alembic
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── models
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   └── scripts
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── services
│   ├── types
│   └── utils
│
└── docker-compose.yml
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yogesh45/retailapp.git

cd retailapp
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file.

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/retail_pricing
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run the database migrations.

```bash
alembic upgrade head
```

Seed the default users.

```bash
python -m scripts.seed_users
```

Seed pricing data.

```bash
python -m scripts.seed_pricing
```

Start the backend server.

```bash
uvicorn app.main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Start the frontend.

```bash
npm run dev
```

---

## Default Users

| Role | Username            | Password  |  
|------|---------------------|-----------|
| Admin | admin@retail.com   | Admin@123 |
| Viewer | viewer@retail.com | Viewer@123|

---

## Performance Optimizations

- Generator-based CSV processing
- Chunk-based database updates
- Batch commits
- Server-side pagination
- Background task processing
- Client-side polling for progress tracking

---

## Security

- JWT Authentication
- Password Hashing
- Role-Based Authorization
- Protected Routes
- Input Validation
- CSV Validation

---

## Future Enhancements

- Azure Blob Storage integration
- Azure Service Bus or RabbitMQ
- WebSocket-based progress updates
- Audit history
- Bulk rollback support
- Advanced filtering
- Dashboard analytics

---

## Author

Yogeshwaran JS

GitHub: https://github.com/yogesh45