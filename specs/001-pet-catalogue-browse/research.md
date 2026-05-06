# Research: Browse Pet Catalogue with Category Filtering
...
## 1. Pagination Strategy

**Decision**: Spring Data JPA `Pageable` (server-side
pagination) with page size 12 on
the backend; React Query infinite scroll or
simple page-number navigation on the frontend.

**Rationale**: The spec (FR-001,
US1 SC3) requires pagination for catalogues > 20 pets.
Server-side pagination
avoids loading the entire dataset. Page size 12 fits a 3-column
grid cleanly on
desktop.
