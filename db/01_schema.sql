-- ============================================================
-- Schéma PostgreSQL — Application restaurants
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL       PRIMARY KEY,
    username      TEXT         NOT NULL UNIQUE,
    mail          TEXT         NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'user',
    phone         VARCHAR(30),
    is_private    BOOLEAN      NOT NULL DEFAULT FALSE
);

-- Follows (users → users)
CREATE TABLE IF NOT EXISTS follow (
    id                SERIAL  PRIMARY KEY,
    follower_user_id  INT     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_user_id INT     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (follower_user_id, following_user_id)
);

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurant (
    id             SERIAL          PRIMARY KEY,
    name           TEXT            NOT NULL,
    address        TEXT,
    phone          VARCHAR(30),
    city           VARCHAR(100),
    country        VARCHAR(100),
    price          VARCHAR(10),
    michelin_stars SMALLINT        CHECK (michelin_stars BETWEEN 0 AND 3),
    menu           TEXT,
    description    TEXT,
    website_url    TEXT,
    latitude       DECIMAL(9,6),
    longitude      DECIMAL(9,6)
);

-- Collections
CREATE TABLE IF NOT EXISTS collection (
    id          SERIAL       PRIMARY KEY,
    user_id     INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    is_private  BOOLEAN      NOT NULL DEFAULT FALSE
);

-- Collection ↔ Restaurant (pivot)
CREATE TABLE IF NOT EXISTS collection_restaurant (
    id            SERIAL PRIMARY KEY,
    collection_id INT    NOT NULL REFERENCES collection(id) ON DELETE CASCADE,
    restaurant_id INT    NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
    notes         TEXT,
    UNIQUE (collection_id, restaurant_id)
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservation (
    id               SERIAL      PRIMARY KEY,
    user_id          INT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id    INT         NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
    reservation_date TIMESTAMPTZ NOT NULL,
    status           VARCHAR(50) NOT NULL DEFAULT 'pending'
);

-- Questions
CREATE TABLE IF NOT EXISTS question (
    id       SERIAL PRIMARY KEY,
    sentence TEXT   NOT NULL
);

-- Answers
CREATE TABLE IF NOT EXISTS answer (
    id          SERIAL PRIMARY KEY,
    sentence    TEXT   NOT NULL,
    question_id INT    NOT NULL REFERENCES question(id) ON DELETE CASCADE
);

-- Tags
CREATE TABLE IF NOT EXISTS tag (
    id   SERIAL       PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50)
);

-- Restaurant ↔ Tag
CREATE TABLE IF NOT EXISTS restaurant_tag (
    id            SERIAL PRIMARY KEY,
    restaurant_id INT    NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
    tag_id        INT    NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
    UNIQUE (restaurant_id, tag_id)
);

-- Answer ↔ Tag (avec score)
CREATE TABLE IF NOT EXISTS answer_tag (
    id        SERIAL PRIMARY KEY,
    answer_id INT    NOT NULL REFERENCES answer(id) ON DELETE CASCADE,
    tag_id    INT    NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
    score     INT    NOT NULL DEFAULT 0,
    UNIQUE (answer_id, tag_id)
);