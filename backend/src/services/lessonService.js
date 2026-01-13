const pool = require('../config/db');

async function getAllLessons(filters = {}) {
  const { term_id, status, content_type, limit = 50, offset = 0 } = filters;

  let query = `
    SELECT l.id, l.term_id, l.lesson_number, l.title, l.content_type,
           l.duration_ms, l.is_paid, l.content_language_primary,
           l.content_languages_available, l.status, l.publish_at,
           l.published_at, l.created_at, l.updated_at,
           t.title as term_title, t.program_id,
           p.title as program_title
    FROM lessons l
    INNER JOIN terms t ON t.id = l.term_id
    INNER JOIN programs p ON p.id = t.program_id
  `;

  const conditions = [];
  const params = [];
  let paramCount = 1;

  if (term_id) {
    conditions.push(`l.term_id = $${paramCount++}`);
    params.push(term_id);
  }

  if (status) {
    conditions.push(`l.status = $${paramCount++}`);
    params.push(status);
  }

  if (content_type) {
    conditions.push(`l.content_type = $${paramCount++}`);
    params.push(content_type);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY t.program_id, t.term_number, l.lesson_number`;
  query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
}

async function getLessonById(id) {
  const lessonResult = await pool.query(
    `SELECT l.*, t.title as term_title, t.program_id,
            p.title as program_title
     FROM lessons l
     INNER JOIN terms t ON t.id = l.term_id
     INNER JOIN programs p ON p.id = t.program_id
     WHERE l.id = $1`,
    [id]
  );

  if (lessonResult.rows.length === 0) {
    const error = new Error('Lesson not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const lesson = lessonResult.rows[0];

  // Get assets
  const assetsResult = await pool.query(
    `SELECT id, language, variant, asset_type, url, created_at
     FROM lesson_assets
     WHERE lesson_id = $1
     ORDER BY language, variant`,
    [id]
  );
  lesson.assets = assetsResult.rows;

  return lesson;
}

async function createLesson(data) {
  const {
    term_id, lesson_number, title, content_type, duration_ms, is_paid = false,
    content_language_primary, content_languages_available, content_urls_by_language,
    subtitle_languages = [], subtitle_urls_by_language = {}, status = 'draft', publish_at
  } = data;

  const result = await pool.query(
    `INSERT INTO lessons (
       term_id, lesson_number, title, content_type, duration_ms, is_paid,
       content_language_primary, content_languages_available, content_urls_by_language,
       subtitle_languages, subtitle_urls_by_language, status, publish_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [
      term_id, lesson_number, title, content_type, duration_ms, is_paid,
      content_language_primary, content_languages_available, JSON.stringify(content_urls_by_language),
      subtitle_languages, JSON.stringify(subtitle_urls_by_language), status, publish_at
    ]
  );

  return result.rows[0];
}

async function updateLesson(id, data) {
  const {
    title, content_type, duration_ms, is_paid,
    content_language_primary, content_languages_available, content_urls_by_language,
    subtitle_languages, subtitle_urls_by_language, status, publish_at
  } = data;

  const result = await pool.query(
    `UPDATE lessons
     SET title = COALESCE($1, title),
         content_type = COALESCE($2, content_type),
         duration_ms = COALESCE($3, duration_ms),
         is_paid = COALESCE($4, is_paid),
         content_language_primary = COALESCE($5, content_language_primary),
         content_languages_available = COALESCE($6, content_languages_available),
         content_urls_by_language = COALESCE($7, content_urls_by_language),
         subtitle_languages = COALESCE($8, subtitle_languages),
         subtitle_urls_by_language = COALESCE($9, subtitle_urls_by_language),
         status = COALESCE($10, status),
         publish_at = COALESCE($11, publish_at),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $12
     RETURNING *`,
    [
      title, content_type, duration_ms, is_paid,
      content_language_primary, content_languages_available,
      content_urls_by_language ? JSON.stringify(content_urls_by_language) : null,
      subtitle_languages,
      subtitle_urls_by_language ? JSON.stringify(subtitle_urls_by_language) : null,
      status, publish_at, id
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error('Lesson not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

async function publishLesson(id) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Publish lesson
    const lessonResult = await client.query(
      `UPDATE lessons
       SET status = 'published',
           published_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (lessonResult.rows.length === 0) {
      const error = new Error('Lesson not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const lesson = lessonResult.rows[0];

    // Auto-publish program if still draft
    await client.query(
      `UPDATE programs
       SET status = 'published',
           published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = (
         SELECT t.program_id
         FROM terms t
         WHERE t.id = $1
       )
       AND status = 'draft'`,
      [lesson.term_id]
    );

    await client.query('COMMIT');
    return lesson;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function scheduleLesson(id, publish_at) {
  const result = await pool.query(
    `UPDATE lessons
     SET status = 'scheduled',
         publish_at = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [publish_at, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Lesson not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

async function archiveLesson(id) {
  const result = await pool.query(
    `UPDATE lessons
     SET status = 'archived',
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Lesson not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

async function deleteLesson(id) {
  const result = await pool.query(
    `DELETE FROM lessons
     WHERE id = $1
     RETURNING id, title`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Lesson not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

module.exports = {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  publishLesson,
  scheduleLesson,
  archiveLesson,
  deleteLesson,
};
