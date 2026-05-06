# Petstore (local workspace)

This workspace contains a Fullstack Petstore reference and specs imported from the instructor's `petstore_speckit` repository.

Files of interest
- [`.specify`](.specify) — speckit configuration and integrations
- [specs/001-pet-catalogue-browse](specs/001-pet-catalogue-browse) — feature spec, plan, tasks, quickstart, and data model
- `backend/` — Spring Boot (Java) backend (maven)
- `frontend/` — React + Vite (TypeScript) frontend

Quickstart

1) Database (Postgres)

Run these commands to create the database and user (adjust passwords as needed):

```powershell
psql -U postgres -c "CREATE DATABASE petstore;"
psql -U postgres -c "CREATE USER petstore_user WITH PASSWORD 'petstore_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE petstore TO petstore_user;"
```

2) Backend

```powershell
cd backend
# Optionally copy application-local.yml and edit DB credentials
cp src/main/resources/application.yml src/main/resources/application-local.yml
# Run backend (Flyway migrations + seed data apply on first start)
mvn spring-boot:run
```

Swagger UI will be available at http://localhost:8080/swagger-ui.html when the backend is running.

3) Frontend

```powershell
cd frontend
npm install
# Dev: create .env.local with VITE_API_BASE_URL=http://localhost:8080
npm run dev
```

Open the app at http://localhost:5173.

Running tests
- Backend: `mvn test` in `backend/`
- Frontend: `npm test -- --watchAll=false` in `frontend/`

.specify and speckit

This project includes speckit configuration under `.specify/` and a feature directory in `specs/001-pet-catalogue-browse` (copied from the instructor's reference). If you want to run speckit/spec-kit workflows locally, install speckit first (the instructor used a speckit integration). Example install (if you have Python/pip):

```powershell
pip install speckit
```

Then run speckit commands per your workflow (e.g., `speckit specify`, `speckit plan`). See `.specify/init-options.json` for the project's speckit integration settings.

Notes
- The instructor's reference code (backend + frontend) was copied into this workspace for reference and quicker bootstrapping.
- If you want, I can run the backend and frontend here to verify everything and/or run speckit verification locally — tell me if you want me to install `speckit` first.
