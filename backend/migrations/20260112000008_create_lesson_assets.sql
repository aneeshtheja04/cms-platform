-- Create lesson_assets table (normalized approach - Option A)
CREATE TABLE lesson_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    variant asset_variant NOT NULL,
    asset_type VARCHAR(50) NOT NULL DEFAULT 'thumbnail',
    url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- DB Constraint: Unique (lesson_id, language, variant, asset_type)
    CONSTRAINT unique_lesson_asset UNIQUE (lesson_id, language, variant, asset_type)
);

-- Indexes for asset lookups (as specified in requirements)
CREATE INDEX idx_lesson_assets_lesson_id ON lesson_assets(lesson_id);
CREATE INDEX idx_lesson_assets_lesson_language ON lesson_assets(lesson_id, language);
CREATE INDEX idx_lesson_assets_lesson_language_variant ON lesson_assets(lesson_id, language, variant);
