-- Create program_topics junction table (many-to-many)
CREATE TABLE program_topics (
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (program_id, topic_id)
);

-- Indexes for M2M lookups (as specified in requirements)
CREATE INDEX idx_program_topics_program_id ON program_topics(program_id);
CREATE INDEX idx_program_topics_topic_id ON program_topics(topic_id);
