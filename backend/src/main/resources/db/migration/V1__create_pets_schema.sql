-- H2 has built-in UUID support, no extension needed

CREATE TABLE IF NOT EXISTS pets (
    id          UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    name        VARCHAR(100)      NOT NULL,
    category    VARCHAR(10)       NOT NULL
                    CONSTRAINT chk_category CHECK (category IN ('DOG','CAT','BIRD','FISH')),
    breed       VARCHAR(100)      NOT NULL,
    age_months  INTEGER           NOT NULL CONSTRAINT chk_age CHECK (age_months >= 0),
    description TEXT              NOT NULL,
    price       NUMERIC(10,2),
    available   BOOLEAN           NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE IF NOT EXISTS pet_photos (
    id          UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    pet_id      UUID         NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    url         CLOB         NOT NULL,
    is_primary  BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order  INTEGER      NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_pets_category   ON pets(category);
CREATE INDEX IF NOT EXISTS idx_photos_pet_id   ON pet_photos(pet_id);
CREATE INDEX IF NOT EXISTS idx_photos_primary  ON pet_photos(pet_id, is_primary);
