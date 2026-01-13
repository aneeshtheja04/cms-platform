const pool = require('../config/db');

/**
 * Helper function to transform flat asset rows into nested structure
 * @param {Array} assetsArray - Flat array of asset rows from DB
 * @param {string} assetType - 'poster' or 'thumbnail'
 * @returns {Object} - Nested structure: { posters: { en: { portrait: '...', landscape: '...' } } }
 */
function transformAssets(assetsArray, assetType = 'poster') {
  const result = { [assetType + 's']: {} };

  for (const asset of assetsArray) {
    if (asset.asset_type === assetType) {
      if (!result[assetType + 's'][asset.language]) {
        result[assetType + 's'][asset.language] = {};
      }
      result[assetType + 's'][asset.language][asset.variant] = asset.url;
    }
  }

  return result;
}

/**
 * Get all published programs with cursor-based pagination
 * Only returns programs with status='published' AND at least 1 published lesson
 * @param {Object} filters - { language, topic_id, cursor, limit }
 * @returns {Promise<Object>} - { data: [...], pagination: { next_cursor, has_more } }
 */
async function getPublishedPrograms(filters = {}) {
  const { language, topic_id, cursor, limit = 20 } = filters;

  let query = `
    SELECT DISTINCT p.id, p.title, p.description,
           p.language_primary, p.languages_available,
           p.status, p.published_at, p.created_at, p.updated_at
    FROM programs p
    WHERE p.status = 'published'
      AND EXISTS (
        SELECT 1 FROM lessons l
        JOIN terms t ON t.id = l.term_id
        WHERE t.program_id = p.id AND l.status = 'published'
      )
  `;

  const conditions = [];
  const params = [];
  let paramCount = 1;

  // Cursor pagination
  if (cursor) {
    conditions.push(`p.published_at < $${paramCount++}`);
    params.push(cursor);
  }

  // Filter by language
  if (language) {
    conditions.push(`p.language_primary = $${paramCount++}`);
    params.push(language);
  }

  // Filter by topic
  if (topic_id) {
    query += ` AND EXISTS (
      SELECT 1 FROM program_topics pt
      WHERE pt.program_id = p.id AND pt.topic_id = $${paramCount++}
    )`;
    params.push(topic_id);
  }

  if (conditions.length > 0) {
    query += ` AND ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY p.published_at DESC LIMIT $${paramCount++}`;
  params.push(limit);

  const result = await pool.query(query, params);
  const data = result.rows;

  // Build pagination info
  const has_more = data.length === limit;
  const next_cursor = has_more ? data[data.length - 1].published_at : null;

  return {
    data,
    pagination: {
      next_cursor,
      has_more
    }
  };
}

/**
 * Get single published program by ID with all details
 * Includes: topics, terms, published lessons only, and assets
 * @param {string} id - Program ID
 * @returns {Promise<Object>} - Program with nested data
 */
async function getPublishedProgramById(id) {
  // Step 1: Get program (must be published)
  const programResult = await pool.query(
    `SELECT p.id, p.title, p.description, p.language_primary,
            p.languages_available, p.status, p.published_at,
            p.created_at, p.updated_at
     FROM programs p
     WHERE p.id = $1
       AND p.status = 'published'
       AND EXISTS (
         SELECT 1 FROM lessons l
         JOIN terms t ON t.id = l.term_id
         WHERE t.program_id = p.id AND l.status = 'published'
       )`,
    [id]
  );

  if (programResult.rows.length === 0) {
    const error = new Error('Program not found or not published');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const program = programResult.rows[0];

  // Step 2: Get topics
  const topicsResult = await pool.query(
    `SELECT t.id, t.name
     FROM topics t
     INNER JOIN program_topics pt ON pt.topic_id = t.id
     WHERE pt.program_id = $1
     ORDER BY t.name`,
    [id]
  );
  program.topics = topicsResult.rows;

  // Step 3: Get program assets
  const programAssetsResult = await pool.query(
    `SELECT id, language, variant, asset_type, url, created_at
     FROM program_assets
     WHERE program_id = $1
     ORDER BY language, variant`,
    [id]
  );
  program.assets = transformAssets(programAssetsResult.rows, 'poster');

  // Step 4: Get terms
  const termsResult = await pool.query(
    `SELECT id, term_number, title, created_at
     FROM terms
     WHERE program_id = $1
     ORDER BY term_number`,
    [id]
  );

  // Step 5: For each term, get published lessons only
  program.terms = [];
  for (const term of termsResult.rows) {
    const lessonsResult = await pool.query(
      `SELECT l.id, l.lesson_number, l.title, l.content_type,
              l.duration_ms, l.is_paid, l.content_language_primary,
              l.content_languages_available, l.content_urls_by_language,
              l.subtitle_languages, l.subtitle_urls_by_language,
              l.status, l.published_at, l.created_at, l.updated_at
       FROM lessons l
       WHERE l.term_id = $1 AND l.status = 'published'
       ORDER BY l.lesson_number`,
      [term.id]
    );

    // Get assets for each lesson
    const lessons = [];
    for (const lesson of lessonsResult.rows) {
      const lessonAssetsResult = await pool.query(
        `SELECT id, language, variant, asset_type, url, created_at
         FROM lesson_assets
         WHERE lesson_id = $1
         ORDER BY language, variant`,
        [lesson.id]
      );
      lesson.assets = transformAssets(lessonAssetsResult.rows, 'thumbnail');
      lessons.push(lesson);
    }

    program.terms.push({
      id: term.id,
      term_number: term.term_number,
      title: term.title,
      created_at: term.created_at,
      lessons
    });
  }

  return program;
}

/**
 * Get single published lesson by ID
 * Only returns if lesson status = 'published'
 * @param {string} id - Lesson ID
 * @returns {Promise<Object>} - Lesson with assets
 */
async function getPublishedLessonById(id) {
  const lessonResult = await pool.query(
    `SELECT l.id, l.term_id, l.lesson_number, l.title,
            l.content_type, l.duration_ms, l.is_paid,
            l.content_language_primary, l.content_languages_available,
            l.content_urls_by_language, l.subtitle_languages,
            l.subtitle_urls_by_language, l.status, l.published_at,
            l.created_at, l.updated_at,
            t.title as term_title, t.program_id,
            p.title as program_title
     FROM lessons l
     INNER JOIN terms t ON t.id = l.term_id
     INNER JOIN programs p ON p.id = t.program_id
     WHERE l.id = $1 AND l.status = 'published'`,
    [id]
  );

  if (lessonResult.rows.length === 0) {
    const error = new Error('Lesson not found or not published');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const lesson = lessonResult.rows[0];

  // Get lesson assets
  const assetsResult = await pool.query(
    `SELECT id, language, variant, asset_type, url, created_at
     FROM lesson_assets
     WHERE lesson_id = $1
     ORDER BY language, variant`,
    [id]
  );
  lesson.assets = transformAssets(assetsResult.rows, 'thumbnail');

  return lesson;
}

module.exports = {
  getPublishedPrograms,
  getPublishedProgramById,
  getPublishedLessonById,
  transformAssets // Export for testing if needed
};
