# LeadSaaS

A modern Lead Management SaaS application built with Laravel, React, MySQL, and Docker.

## Features

- Lead Management
- Pipeline Management
- Company Management
- REST API
- React Dashboard
- Docker Support
- MySQL Integration
- Seeded Sample Data

## Tech Stack

### Backend

- PHP 8.3
- Laravel 12
- MySQL 8
- Laravel Sanctum

### Frontend

- React
- Vite
- Axios

### DevOps

- Docker
- Docker Compose

## Project Structure

```text
LeadSaaS/
├── README.md
├── docker-compose.yml
├── leads-backend/
│   ├── app/
│   ├── routes/
│   ├── database/
│   ├── Dockerfile
│   └── .env.example
└── leads-frontend/
    ├── src/
    ├── public/
    ├── Dockerfile
    └── vite.config.js
````

## Installation

```bash
git clone https://github.com/prabath321/LeadSaaS.git
cd LeadSaaS
```

## Docker Setup

Start application:

```bash
docker compose up --build
```

Stop application:

```bash
docker compose down
```

## Backend Setup

Generate Laravel key:

```bash
docker compose run --rm leads-backend php artisan key:generate
```

Run migrations:

```bash
docker compose run --rm leads-backend php artisan migrate
```

Seed database:

```bash
docker compose run --rm leads-backend php artisan db:seed
```

## Access URLs

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:8000](http://localhost:8000) |
| MySQL       | localhost:3307                                 |

## Default Test User

```text
Email: john.doe@example.com
Password: password
```

## API Endpoints

### Leads

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/api/leads`      |
| POST   | `/api/leads`      |
| PUT    | `/api/leads/{id}` |
| DELETE | `/api/leads/{id}` |

### Pipelines

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/api/pipelines` |

### Companies

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/api/companies` |

## Common Issues

### MySQL Connection Refused

Use:

```env
DB_HOST=leads-mysql
```

Do not use:

```env
DB_HOST=127.0.0.1
```

### Frontend Cannot Reach Backend

Use this in `vite.config.js`:

```js
target: 'http://leads-backend:8000'
```

Do not use:

```js
target: 'http://127.0.0.1:8000'
```

## Future Improvements

* Authentication
* Role Management
* Analytics Dashboard
* Email Notifications
* Kanban Pipelines
* Multi-Tenant Support

## License

MIT License

## Author

Pium Leevanage
Full Stack Developer | Laravel + React Engineer | Software Consultant

```
```

