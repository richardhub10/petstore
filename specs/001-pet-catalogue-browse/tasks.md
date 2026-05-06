# Tasks: Browse Pet Catalogue with Category Filtering
...
## Phase 1: Setup
(Shared Infrastructure)

**Purpose**: Project initialization — backend and
frontend scaffolding, tooling, and
shared config. No user story work depends on this
being split into multiple steps;
all [P] tasks here can start
simultaneously.

- [ ] T001 Initialize Maven Spring Boot 3.x project in `backend/` with
dependencies: spring-boot-starter-web, spring-boot-starter-data-jpa, flyway-core,
postgresql, springdoc-openapi-starter-webmvc-ui, spring-boot-starter-test
- [ ] T002
[P] Initialize React + Vite + TypeScript project in `frontend/` and install
dependencies: react-router-dom@6, @mui/material, @mui/icons-material, @emotion/react,
@emotion/styled, tailwindcss, @tanstack/react-query, axios
- [ ] T003 [P]
...

## Phase 2: Foundational
(Blocking Prerequisites)

**Purpose**: Core backend infrastructure that ALL user
stories depend on. No user story
can be implemented until this phase is
complete.

- [ ] T007 Create `Category` enum in
`backend/src/main/java/com/petstore/pet/Category.java` with values DOG, CAT, BIRD, FISH
- [ ] T008 [P] Create Flyway
migration `backend/src/main/resources/db/migration/V1__create_pets_schema.sql` — creates `pets` table (id UUID PK, name, category CHECK constraint, breed,
age_months, description, price NUMERIC nullable, available BOOLEAN, created_at) and
`pet_photos` table (id UUID PK, pet_id FK cascade, url, is_primary BOOLEAN,
...
