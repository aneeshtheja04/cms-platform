-- Create terms table
CREATE TABLE terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    term_number INTEGER NOT NULL,
    title VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- DB Constraint: Unique (program_id, term_number)
    CONSTRAINT unique_program_term_number UNIQUE (program_id, term_number),

    -- Validation
    CONSTRAINT check_term_number_positive CHECK (term_number > 0)
);

-- Indexes
CREATE INDEX idx_terms_program_id ON terms(program_id);
CREATE INDEX idx_terms_program_term_number ON terms(program_id, term_number);
