const pool = require('../config/db');

/**
 * Find all scheduled lessons that are ready to be published
 * @returns {Promise<Array>} Array of lessons ready to publish
 */
async function findScheduledLessons() {
  const result = await pool.query(`
    SELECT id, term_id, title
    FROM lessons
    WHERE status = 'scheduled'
      AND publish_at <= NOW()
    ORDER BY publish_at ASC
  `);
  return result.rows;
}

/**
 * Publish a single lesson and auto-publish its parent program if needed
 * @param {string} lessonId - UUID of the lesson to publish
 * @returns {Promise<Object>} Result object with success status and details
 */
async function publishLesson(lessonId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Publish lesson (conditional update for idempotency)
    const lessonResult = await client.query(`
      UPDATE lessons
      SET status = 'published',
          published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND status = 'scheduled'
      RETURNING id, term_id, title, published_at
    `, [lessonId]);

    // Check if update succeeded (0 rows = already published by another worker)
    if (lessonResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, reason: 'already_published' };
    }

    const lesson = lessonResult.rows[0];

    // Step 2: Auto-publish parent program (if draft)
    const programResult = await client.query(`
      UPDATE programs p
      SET status = 'published',
          published_at = COALESCE(p.published_at, CURRENT_TIMESTAMP),
          updated_at = CURRENT_TIMESTAMP
      FROM terms t
      WHERE t.id = $1
        AND p.id = t.program_id
        AND p.status = 'draft'
      RETURNING p.id, p.title
    `, [lesson.term_id]);

    await client.query('COMMIT');

    return {
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        published_at: lesson.published_at
      },
      program: programResult.rows.length > 0 ? {
        id: programResult.rows[0].id,
        title: programResult.rows[0].title,
        auto_published: true
      } : null
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Process all scheduled lessons that are ready to be published
 * @returns {Promise<Object>} Statistics about the processing run
 */
async function processScheduledLessons() {
  const startTime = Date.now();

  try {
    const lessons = await findScheduledLessons();

    if (lessons.length === 0) {
      console.log('[Worker] No scheduled lessons to publish');
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    console.log(`[Worker] Found ${lessons.length} lesson(s) ready to publish`);

    let succeeded = 0;
    let failed = 0;

    for (const lesson of lessons) {
      try {
        const result = await publishLesson(lesson.id);

        if (result.success) {
          succeeded++;
          console.log(`✅ Published lesson: ${lesson.title} (${lesson.id})`);

          if (result.program) {
            console.log(`  ↳ Auto-published program: ${result.program.title}`);
          }
        } else {
          console.log(`⏭️  Skipped lesson ${lesson.id}: ${result.reason}`);
        }

      } catch (error) {
        failed++;
        console.error(`❌ Failed to publish lesson ${lesson.id}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[Worker] Completed in ${duration}ms: ${succeeded} succeeded, ${failed} failed`);

    return { processed: lessons.length, succeeded, failed };

  } catch (error) {
    console.error('[Worker] Error processing scheduled lessons:', error);
    throw error;
  }
}

module.exports = {
  findScheduledLessons,
  publishLesson,
  processScheduledLessons
};
