require('dotenv').config({ path: '../.env' });
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function runSeed() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'cms_user',
    password: process.env.DB_PASSWORD || 'cms_pass',
    database: process.env.DB_NAME || 'cms',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    await client.query('BEGIN');

    // 1. Create users with RBAC
    console.log('Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const editorPassword = await bcrypt.hash('editor123', 10);
    const viewerPassword = await bcrypt.hash('viewer123', 10);

    await client.query(`
      INSERT INTO users (email, password_hash, name, role) VALUES
      ('admin@cms.com', $1, 'Admin User', 'admin'),
      ('editor@cms.com', $2, 'Editor User', 'editor'),
      ('viewer@cms.com', $3, 'Viewer User', 'viewer')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword, editorPassword, viewerPassword]);

    // 2. Create topics
    console.log('Creating topics...');
    await client.query(`
      INSERT INTO topics (name) VALUES
      ('Mathematics'),
      ('Science'),
      ('Programming'),
      ('Language Learning')
      ON CONFLICT (name) DO NOTHING
    `);

    // Fetch all topics (including existing ones)
    const topicsResult = await client.query(`
      SELECT id, name FROM topics
    `);

    const topics = {};
    topicsResult.rows.forEach(row => {
      topics[row.name] = row.id;
    });

    // 3. Create programs (2 programs as required)
    console.log('Creating programs...');

    // Check if programs already exist
    const existingProgramsResult = await client.query(`
      SELECT COUNT(*) as count FROM programs
    `);

    if (parseInt(existingProgramsResult.rows[0].count) > 0) {
      console.log('⏭️  Programs already exist, skipping seed data creation');
      await client.query('COMMIT');
      console.log('\n✅ Database already seeded!');
      return;
    }

    // Program 1: Multi-language (Telugu and English)
    const program1Result = await client.query(`
      INSERT INTO programs (
        title, description, language_primary, languages_available, status
      ) VALUES (
        'Introduction to Programming',
        'Learn programming fundamentals with hands-on examples and projects',
        'en',
        ARRAY['en', 'te'],
        'draft'
      )
      RETURNING id
    `);
    const program1Id = program1Result.rows[0].id;

    // Program 2: Single language (Hindi)
    const program2Result = await client.query(`
      INSERT INTO programs (
        title, description, language_primary, languages_available, status
      ) VALUES (
        'गणित की मूल बातें',
        'बुनियादी गणित की अवधारणाओं को सीखें',
        'hi',
        ARRAY['hi'],
        'draft'
      )
      RETURNING id
    `);
    const program2Id = program2Result.rows[0].id;

    // 4. Create program-topic associations
    console.log('Creating program-topic associations...');
    await client.query(`
      INSERT INTO program_topics (program_id, topic_id) VALUES
      ($1, $2),
      ($3, $4),
      ($5, $6)
    `, [
      program1Id, topics['Programming'],
      program1Id, topics['Science'],
      program2Id, topics['Mathematics']
    ]);

    // 5. Create program assets (posters)
    console.log('Creating program assets...');
    await client.query(`
      INSERT INTO program_assets (program_id, language, variant, asset_type, url) VALUES
      -- Program 1 - English posters
      ($1, 'en', 'portrait', 'poster', 'https://picsum.photos/400/600?random=1'),
      ($1, 'en', 'landscape', 'poster', 'https://picsum.photos/800/450?random=2'),
      ($1, 'en', 'square', 'poster', 'https://picsum.photos/500/500?random=3'),
      -- Program 1 - Telugu posters
      ($1, 'te', 'portrait', 'poster', 'https://picsum.photos/400/600?random=4'),
      ($1, 'te', 'landscape', 'poster', 'https://picsum.photos/800/450?random=5'),
      -- Program 2 - Hindi posters
      ($2, 'hi', 'portrait', 'poster', 'https://picsum.photos/400/600?random=6'),
      ($2, 'hi', 'landscape', 'poster', 'https://picsum.photos/800/450?random=7'),
      ($2, 'hi', 'square', 'poster', 'https://picsum.photos/500/500?random=8')
    `, [program1Id, program2Id]);

    // 6. Create terms (2 terms total as required)
    console.log('Creating terms...');
    const term1Result = await client.query(`
      INSERT INTO terms (program_id, term_number, title) VALUES
      ($1, 1, 'Getting Started')
      RETURNING id
    `, [program1Id]);
    const term1Id = term1Result.rows[0].id;

    const term2Result = await client.query(`
      INSERT INTO terms (program_id, term_number, title) VALUES
      ($1, 1, 'बुनियादी संचालन')
      RETURNING id
    `, [program2Id]);
    const term2Id = term2Result.rows[0].id;

    // 7. Create lessons (6 total as required)
    console.log('Creating lessons...');

    // Calculate publish_at for scheduled lesson (within next 2 minutes)
    const scheduledPublishAt = new Date(Date.now() + 90000); // 1.5 minutes from now

    // Lesson 1: Published video lesson with multi-language content
    const lesson1Result = await client.query(`
      INSERT INTO lessons (
        term_id, lesson_number, title, content_type, duration_ms, is_paid,
        content_language_primary, content_languages_available, content_urls_by_language,
        subtitle_languages, subtitle_urls_by_language,
        status, published_at
      ) VALUES (
        $1, 1, 'Introduction to Variables',
        'video', 600000, false,
        'en', ARRAY['en', 'te'],
        '{"en": "https://example.com/videos/lesson1-en.mp4", "te": "https://example.com/videos/lesson1-te.mp4"}'::jsonb,
        ARRAY['en', 'te', 'hi'],
        '{"en": "https://example.com/subtitles/lesson1-en.vtt", "te": "https://example.com/subtitles/lesson1-te.vtt", "hi": "https://example.com/subtitles/lesson1-hi.vtt"}'::jsonb,
        'published', CURRENT_TIMESTAMP
      )
      RETURNING id
    `, [term1Id]);
    const lesson1Id = lesson1Result.rows[0].id;

    // Lesson 2: Published article lesson
    const lesson2Result = await client.query(`
      INSERT INTO lessons (
        term_id, lesson_number, title, content_type, is_paid,
        content_language_primary, content_languages_available, content_urls_by_language,
        status, published_at
      ) VALUES (
        $1, 2, 'Understanding Data Types',
        'article', false,
        'en', ARRAY['en'],
        '{"en": "https://example.com/articles/lesson2-en.html"}'::jsonb,
        'published', CURRENT_TIMESTAMP
      )
      RETURNING id
    `, [term1Id]);
    const lesson2Id = lesson2Result.rows[0].id;

    // Lesson 3: Scheduled lesson (will be published by worker)
    const lesson3Result = await client.query(`
      INSERT INTO lessons (
        term_id, lesson_number, title, content_type, duration_ms, is_paid,
        content_language_primary, content_languages_available, content_urls_by_language,
        status, publish_at
      ) VALUES (
        $1, 3, 'Control Structures',
        'video', 480000, true,
        'en', ARRAY['en'],
        '{"en": "https://example.com/videos/lesson3-en.mp4"}'::jsonb,
        'scheduled', $2
      )
      RETURNING id
    `, [term1Id, scheduledPublishAt]);
    const lesson3Id = lesson3Result.rows[0].id;

    // Lesson 4: Draft lesson
    const lesson4Result = await client.query(`
      INSERT INTO lessons (
        term_id, lesson_number, title, content_type, is_paid,
        content_language_primary, content_languages_available, content_urls_by_language,
        status
      ) VALUES (
        $1, 4, 'Functions and Methods',
        'article', false,
        'en', ARRAY['en'],
        '{"en": "https://example.com/articles/lesson4-en.html"}'::jsonb,
        'draft'
      )
      RETURNING id
    `, [term1Id]);
    const lesson4Id = lesson4Result.rows[0].id;

    // Lesson 5: Published Hindi lesson
    const lesson5Result = await client.query(`
      INSERT INTO lessons (
        term_id, lesson_number, title, content_type, duration_ms, is_paid,
        content_language_primary, content_languages_available, content_urls_by_language,
        status, published_at
      ) VALUES (
        $1, 1, 'संख्याओं के साथ काम करना',
        'video', 540000, false,
        'hi', ARRAY['hi'],
        '{"hi": "https://example.com/videos/lesson5-hi.mp4"}'::jsonb,
        'published', CURRENT_TIMESTAMP
      )
      RETURNING id
    `, [term2Id]);
    const lesson5Id = lesson5Result.rows[0].id;

    // Lesson 6: Draft Hindi lesson
    const lesson6Result = await client.query(`
      INSERT INTO lessons (
        term_id, lesson_number, title, content_type, is_paid,
        content_language_primary, content_languages_available, content_urls_by_language,
        status
      ) VALUES (
        $1, 2, 'जोड़ और घटाव',
        'article', false,
        'hi', ARRAY['hi'],
        '{"hi": "https://example.com/articles/lesson6-hi.html"}'::jsonb,
        'draft'
      )
      RETURNING id
    `, [term2Id]);
    const lesson6Id = lesson6Result.rows[0].id;

    // 8. Create lesson assets (thumbnails)
    console.log('Creating lesson assets...');
    await client.query(`
      INSERT INTO lesson_assets (lesson_id, language, variant, asset_type, url) VALUES
      -- Lesson 1 - English thumbnails
      ($1, 'en', 'portrait', 'thumbnail', 'https://picsum.photos/400/600?random=10'),
      ($1, 'en', 'landscape', 'thumbnail', 'https://picsum.photos/800/450?random=11'),
      -- Lesson 1 - Telugu thumbnails
      ($1, 'te', 'portrait', 'thumbnail', 'https://picsum.photos/400/600?random=12'),
      ($1, 'te', 'landscape', 'thumbnail', 'https://picsum.photos/800/450?random=13'),
      -- Lesson 2 - English thumbnails
      ($2, 'en', 'portrait', 'thumbnail', 'https://picsum.photos/400/600?random=14'),
      ($2, 'en', 'landscape', 'thumbnail', 'https://picsum.photos/800/450?random=15'),
      -- Lesson 3 - English thumbnails
      ($3, 'en', 'portrait', 'thumbnail', 'https://picsum.photos/400/600?random=16'),
      ($3, 'en', 'landscape', 'thumbnail', 'https://picsum.photos/800/450?random=17'),
      -- Lesson 4 - English thumbnails
      ($4, 'en', 'portrait', 'thumbnail', 'https://picsum.photos/400/600?random=18'),
      ($4, 'en', 'landscape', 'thumbnail', 'https://picsum.photos/800/450?random=19'),
      -- Lesson 5 - Hindi thumbnails
      ($5, 'hi', 'portrait', 'thumbnail', 'https://picsum.photos/400/600?random=20'),
      ($5, 'hi', 'landscape', 'thumbnail', 'https://picsum.photos/800/450?random=21'),
      -- Lesson 6 - Hindi thumbnails
      ($6, 'hi', 'portrait', 'thumbnail', 'https://picsum.photos/400/600?random=22'),
      ($6, 'hi', 'landscape', 'thumbnail', 'https://picsum.photos/800/450?random=23')
    `, [lesson1Id, lesson2Id, lesson3Id, lesson4Id, lesson5Id, lesson6Id]);

    // 9. Auto-publish programs that have published lessons
    console.log('Auto-publishing programs with published lessons...');
    await client.query(`
      UPDATE programs
      SET status = 'published',
          published_at = COALESCE(published_at, CURRENT_TIMESTAMP)
      WHERE id IN (
        SELECT DISTINCT p.id
        FROM programs p
        INNER JOIN terms t ON t.program_id = p.id
        INNER JOIN lessons l ON l.term_id = t.id
        WHERE l.status = 'published'
      )
      AND status = 'draft'
    `);

    await client.query('COMMIT');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest Users:');
    console.log('  Admin:  admin@cms.com / admin123');
    console.log('  Editor: editor@cms.com / editor123');
    console.log('  Viewer: viewer@cms.com / viewer123');
    console.log(`\nScheduled lesson will be published at: ${scheduledPublishAt.toISOString()}`);
    console.log('\nData Summary:');
    console.log('  - 3 Users (admin, editor, viewer)');
    console.log('  - 4 Topics');
    console.log('  - 2 Programs (1 multi-language, 1 single-language)');
    console.log('  - 2 Terms');
    console.log('  - 6 Lessons (2 published, 1 scheduled, 3 draft)');
    console.log('  - Program assets with portrait + landscape variants');
    console.log('  - Lesson thumbnails with portrait + landscape variants');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();
