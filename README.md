LeadSaaS

A modern Lead Management SaaS application built with:

Backend: Laravel 12
Frontend: React + Vite
Database: MySQL 8
Dockerized development environment
Features
Lead Management
Pipeline Management
Company Management
REST API
React Dashboard
Docker Support
MySQL Integration
Seeded Sample Data
Tech Stack
Backend
PHP 8.3
Laravel 12
MySQL 8
Laravel Sanctum
Frontend
React
Vite
Axios
DevOps
Docker
Docker Compose
Project Structure
LeadSaaS/
│
├── docker-compose.yml
│
├── leads-backend/
│   ├── app/
│   ├── routes/
│   ├── database/
│   ├── Dockerfile
│   └── .env
│
└── leads-frontend/
    ├── src/
    ├── public/
    ├── Dockerfile
    └── vite.config.js
Installation
Clone Repository
git clone https://github.com/yourusername/LeadSaaS.git
cd LeadSaaS
Docker Setup
Start Application
docker compose up --build
Stop Application
docker compose down
Backend Setup
Generate Laravel Key
docker compose run --rm leads-backend php artisan key:generate
Run Migrations
docker compose run --rm leads-backend php artisan migrate
Seed Database
docker compose run --rm leads-backend php artisan db:seed
Access URLs
Service	URL
Frontend	http://localhost:5173
Backend API	http://localhost:8000
MySQL	localhost:3307
Default Test User
Email: john.doe@example.com
Password: pass
API Endpoints
Leads
Method	Endpoint
GET	/api/leads
POST	/api/leads
PUT	/api/leads/{id}
DELETE	/api/leads/{id}
Pipelines
Method	Endpoint
GET	/api/pipelines
Companies
Method	Endpoint
GET	/api/companies
Docker Commands
Rebuild Containers
docker compose up --build
Remove Containers
docker compose down --remove-orphans
Remove All Containers
docker rm -f $(docker ps -aq)
Common Issues
MySQL Connection Refused

Ensure .env contains:

DB_HOST=leads-mysql

NOT:

DB_HOST=127.0.0.1
Frontend Cannot Reach Backend

Ensure vite.config.js contains:

target: 'http://leads-backend:8000'

NOT:

target: 'http://127.0.0.1:8000'
Future Improvements
Authentication
JWT/Sanctum Security
Role Management
Analytics Dashboard
Email Notifications
Kanban Pipelines
Multi-Tenant Support
License

MIT License

Author

Prabath Kumarasinghe

Full Stack Developer
Laravel + React Engineer
Software Consultant
