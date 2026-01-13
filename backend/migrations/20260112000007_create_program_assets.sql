-- Create asset variant enum
CREATE TYPE asset_variant AS ENUM ('portrait', 'landscape', 'square', 'banner');

-- Create program_assets table (normalized approach - Option A)
CREATE TABLE program_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    variant asset_variant NOT NULL,
    asset_type VARCHAR(50) NOT NULL DEFAULT 'poster',
    url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- DB Constraint: Unique (program_id, language, variant, asset_type)
    CONSTRAINT unique_program_asset UNIQUE (program_id, language, variant, asset_type)
);

-- Indexes for asset lookups (as specified in requirements)
CREATE INDEX idx_program_assets_program_id ON program_assets(program_id);
CREATE INDEX idx_program_assets_program_language ON program_assets(program_id, language);
CREATE INDEX idx_program_assets_program_language_variant ON program_assets(program_id, language, variant);
