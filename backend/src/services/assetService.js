const pool = require('../config/db');

// ============ PROGRAM ASSETS ============

async function getProgramAssets(program_id) {
  const result = await pool.query(
    `SELECT id, program_id, language, variant, asset_type, url, created_at
     FROM program_assets
     WHERE program_id = $1
     ORDER BY language, variant`,
    [program_id]
  );
  return result.rows;
}

async function createProgramAsset(data) {
  const { program_id, language, variant, url } = data;

  const result = await pool.query(
    `INSERT INTO program_assets (program_id, language, variant, asset_type, url)
     VALUES ($1, $2, $3, 'poster', $4)
     RETURNING id, program_id, language, variant, asset_type, url, created_at`,
    [program_id, language, variant, url]
  );

  return result.rows[0];
}

async function deleteProgramAsset(id) {
  const result = await pool.query(
    `DELETE FROM program_assets
     WHERE id = $1
     RETURNING id, program_id, language, variant`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Program asset not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

// ============ LESSON ASSETS ============

async function getLessonAssets(lesson_id) {
  const result = await pool.query(
    `SELECT id, lesson_id, language, variant, asset_type, url, created_at
     FROM lesson_assets
     WHERE lesson_id = $1
     ORDER BY language, variant`,
    [lesson_id]
  );
  return result.rows;
}

async function createLessonAsset(data) {
  const { lesson_id, language, variant, url } = data;

  const result = await pool.query(
    `INSERT INTO lesson_assets (lesson_id, language, variant, asset_type, url)
     VALUES ($1, $2, $3, 'thumbnail', $4)
     RETURNING id, lesson_id, language, variant, asset_type, url, created_at`,
    [lesson_id, language, variant, url]
  );

  return result.rows[0];
}

async function deleteLessonAsset(id) {
  const result = await pool.query(
    `DELETE FROM lesson_assets
     WHERE id = $1
     RETURNING id, lesson_id, language, variant`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Lesson asset not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

module.exports = {
  getProgramAssets,
  createProgramAsset,
  deleteProgramAsset,
  getLessonAssets,
  createLessonAsset,
  deleteLessonAsset,
};
