CREATE SCHEMA apk_miror AUTHORIZATION postgres;

CREATE TABLE IF NOT EXISTS apk_miror.apk_distributions (
    id serial4 NOT NULL,
    "version" text NOT NULL,
    mongo_id text NOT NULL,
    last_processed_date timestamptz NOT NULL,
    CONSTRAINT apk_distributions_pkey PRIMARY KEY (id)
);