-- Create lesson enums
CREATE TYPE content_type AS ENUM ('video', 'article');
CREATE TYPE lesson_status AS ENUM ('draft', 'scheduled', 'published', 'archived');

-- Create lessons table
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,

    -- Content type
    content_type content_type NOT NULL,
    duration_ms INTEGER,
    is_paid BOOLEAN NOT NULL DEFAULT false,

    -- Multi-language content
    content_language_primary VARCHAR(10) NOT NULL,
    content_languages_available TEXT[] NOT NULL DEFAULT '{}',
    content_urls_by_language JSONB NOT NULL DEFAULT '{}',

    -- Subtitles
    subtitle_languages TEXT[] DEFAULT '{}',
    subtitle_urls_by_language JSONB DEFAULT '{}',

    -- Publishing workflow
    status lesson_status NOT NULL DEFAULT 'draft',
    publish_at TIMESTAMP,
    published_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- DB Constraints (as specified in requirements)

    -- Unique (term_id, lesson_number)
    CONSTRAINT unique_term_lesson_number UNIQUE (term_id, lesson_number),

    -- If content_type='video', duration_ms must be provided
    CONSTRAINT check_video_duration CHECK (
        content_type != 'video' OR duration_ms IS NOT NULL
    ),

    -- If status='scheduled', publish_at must be NOT NULL
    CONSTRAINT check_scheduled_has_publish_at CHECK (
        status != 'scheduled' OR publish_at IS NOT NULL
    ),

    -- If status='published', published_at must be NOT NULL
    CONSTRAINT check_published_has_published_at CHECK (
        status != 'published' OR published_at IS NOT NULL
    ),

    -- Primary content language must be in available languages
    CONSTRAINT check_content_primary_in_available CHECK (
        content_language_primary = ANY(content_languages_available)
    ),

    -- Primary language must have content URL in content_urls_by_language
    CONSTRAINT check_content_primary_has_url CHECK (
        content_urls_by_language ? content_language_primary
    ),

    -- Validation
    CONSTRAINT check_lesson_number_positive CHECK (lesson_number > 0),
    CONSTRAINT check_duration_positive CHECK (duration_ms IS NULL OR duration_ms > 0)
);

-- Indexes for performance (as specified in requirements)
CREATE INDEX idx_lessons_term_id ON lessons(term_id);
CREATE INDEX idx_lessons_term_lesson_number ON lessons(term_id, lesson_number);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lessons_status_publish_at ON lessons(status, publish_at);
CREATE INDEX idx_lessons_published_at ON lessons(published_at);
CREATE INDEX idx_lessons_content_type ON lessons(content_type);

-- Trigger to update updated_at
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
