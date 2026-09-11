CREATE TABLE IF NOT EXISTS nr_manager_state (
  id integer PRIMARY KEY CHECK (id=1),
  revision integer NOT NULL DEFAULT 0,
  records jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(records)='array'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS nr_manager_history (
  revision integer PRIMARY KEY,
  records jsonb NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO nr_manager_state(id) VALUES(1) ON CONFLICT(id) DO NOTHING;
