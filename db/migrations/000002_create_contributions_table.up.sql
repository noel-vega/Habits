CREATE TABLE IF NOT EXISTS contributions (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

CREATE INDEX idx_contributions_habit_id ON contributions(habit_id);
CREATE INDEX idx_contributions_date ON contributions(date);
CREATE UNIQUE INDEX idx_contributions_habit_date ON contributions(habit_id, date);
