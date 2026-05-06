# Implementation Plan: Browse Pet Catalogue with Category Filtering
...
## Summary

Implement the Petstore public-facing pet catalogue: a paginated
grid of pet cards
browsable by any visitor, filterable by category (Dogs / Cats /
Birds / Fish), with
URL-persistent filters and a detail page per pet. The
backend exposes two REST
endpoints (`GET /api/pets` with optional category query
params, `GET /api/pets/{id}`).
The frontend renders the catalogue and detail views
using React + MUI + Tailwind, reading
from those endpoints. Seed data is delivered
via a Flyway migration.

## Technical Context

**Language/Version**: Java 17
(backend) · Node 20 / TypeScript (frontend)
**Primary Dependencies**:
- Backend:
Spring Boot 3.x, Spring Data JPA, Flyway, SpringDoc OpenAPI 2.x, PostgreSQL
driver
- Frontend: React 18, React Router 6, MUI v5, Tailwind CSS v3, Axios, React
Query

**Storage**: PostgreSQL 15 — `pets` table + `pet_photos`
table
**Testing**:
- Backend: JUnit 5 + Mockito + Spring Boot Test (`@WebMvcTest`,
`@DataJpaTest`)
- Frontend: React Testing Library + Jest (smoke + interaction tests)
