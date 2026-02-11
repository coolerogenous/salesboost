const db = require('./src/config/db');

async function migrate() {
    const connection = await db.getConnection();
    try {
        console.log('Starting migration...');

        // 1. Check if 'images' column exists in 'tasks'
        const [taskCols] = await connection.execute("SHOW COLUMNS FROM tasks LIKE 'images'");
        if (taskCols.length === 0) {
            await connection.execute("ALTER TABLE tasks ADD COLUMN images JSON DEFAULT NULL COMMENT 'JSON array of image paths'");
            console.log('Added images column to tasks table.');
        } else {
            console.log('images column already exists in tasks table.');
        }

        // 2. Check and add columns to 'submissions'
        const [subCols] = await connection.execute("SHOW COLUMNS FROM submissions LIKE 'images'");
        if (subCols.length === 0) {
            await connection.execute("ALTER TABLE submissions ADD COLUMN images JSON DEFAULT NULL COMMENT 'JSON array of proof image paths'");
            console.log('Added images column to submissions table.');

            // Migrate existing image_url data to images array
            await connection.execute("UPDATE submissions SET images = JSON_ARRAY(image_url) WHERE image_url IS NOT NULL AND images IS NULL");
            console.log('Migrated existing image_url to images array.');
        }

        const [textCols] = await connection.execute("SHOW COLUMNS FROM submissions LIKE 'text_content'");
        if (textCols.length === 0) {
            await connection.execute("ALTER TABLE submissions ADD COLUMN text_content TEXT DEFAULT NULL COMMENT 'Optional user remarks'");
            console.log('Added text_content column to submissions table.');
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

migrate();
