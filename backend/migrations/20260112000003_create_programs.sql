-- Create program status enum
CREATE TYPE program_status AS ENUM ('draft', 'published', 'archived');

-- Create programs table
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    language_primary VARCHAR(10) NOT NULL,
    languages_available TEXT[] NOT NULL DEFAULT '{}',
    status program_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: primary language must be in available languages
    CONSTRAINT check_primary_in_available CHECK (language_primary = ANY(languages_available))
);

-- Indexes for performance (as specified in requirements)
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_language_primary ON programs(language_primary);
CREATE INDEX idx_programs_published_at ON programs(published_at);
CREATE INDEX idx_programs_status_language_published ON programs(status, language_primary, published_at);

-- Trigger to update updated_at
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
