# Data Model: Browse Pet Catalogue with Category Filtering
...
## Entities

### Pet

Represents
a single pet available in the store catalogue.

| Field | Type | Constraints |
Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, NOT NULL |
Auto-generated (UUID v4) |
| `name` | VARCHAR(100) | NOT NULL | Display name, e.g.
"Buddy" |
| `category` | VARCHAR(10) | NOT NULL, CHECK IN
('DOG','CAT','BIRD','FISH') | Fixed set per constitution |
| `breed` | VARCHAR(100) | NOT NULL | Breed
or species name |
| `age_months` | INTEGER | NOT NULL, ≥ 0 | Age in months for
precision |
| `description` | TEXT | NOT NULL | Full narrative shown on detail
page |
| `price` | NUMERIC(10,2) | NULL allowed | NULL → display "Contact us for
pricing" |
...

### PetPhoto

Stores one or more photos for a Pet. Exactly one photo per pet must be designated
primary.

| Field | Type | Constraints | Notes
|
|-------|------|-------------|-------|
| `id` | UUID | PK, NOT NULL | Auto-generated |
| `pet_id` | UUID | NOT
NULL, FK → pets(id) ON DELETE CASCADE | Owning pet |
| `url` | VARCHAR(500) |
NOT NULL | Absolute or root-relative URL |
| `is_primary` | BOOLEAN | NOT NULL,
DEFAULT FALSE | One TRUE per pet for card thumbnail |
| `sort_order` | INTEGER |
NOT NULL, DEFAULT 0 | Display order on detail page |
