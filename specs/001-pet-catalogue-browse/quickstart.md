# Quickstart: Browse Pet Catalogue with Category Filtering
...
## Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Java
| 17 | [adoptium.net](https://adoptium.net/) |
| Maven | 3.8 |
[maven.apache.org](https://maven.apache.org/) |
| Node.js | 20 |
[nodejs.org](https://nodejs.org/) |
| PostgreSQL | 15 | [postgresql.org](https://www.postgresql.org/) |

---

## 1. Database Setup

```bash
# Create database and user
psql -U postgres -c
"CREATE DATABASE petstore;"
psql -U postgres -c "CREATE USER petstore_user WITH
PASSWORD 'petstore_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE
petstore TO petstore_user;"
```

Flyway migrations run automatically on Spring Boot
startup — no manual schema creation needed.

---

## 2. Backend
Setup

```bash
cd backend

# Configure database connection (copy and edit)
cp
src/main/resources/application.yml src/main/resources/application-local.yml
```
