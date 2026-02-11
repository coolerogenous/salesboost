const db = require('./src/config/db');

async function debug() {
    try {
        console.log('Testing DB Insertion...');

        // 1. Get a valid user
        const [users] = await db.execute('SELECT id FROM users LIMIT 1');
        if (users.length === 0) {
            console.log('No users found.');
            return;
        }
        const userId = users[0].id;

        // 2. Get a valid task
        const [tasks] = await db.execute('SELECT id FROM tasks LIMIT 1');
        if (tasks.length === 0) {
            console.log('No tasks found.');
            return;
        }
        const taskId = tasks[0].id;

        console.log(`User ID: ${userId}, Task ID: ${taskId}`);

        // 3. Try Insert
        const images = ['test.png'];
        const imagesJson = JSON.stringify(images);
        const mainImage = images[0];
        const textContent = 'Debug test content';

        console.log('Executing INSERT...');
        const [result] = await db.execute(
            'INSERT INTO submissions (user_id, task_id, image_url, images, text_content) VALUES (?, ?, ?, ?, ?)',
            [userId, taskId, mainImage, imagesJson, textContent]
        );
        console.log('Insert Success:', result.insertId);

        // Clean up
        await db.execute('DELETE FROM submissions WHERE id = ?', [result.insertId]);

    } catch (error) {
        console.error('Insert Failed:', error);
    } finally {
        process.exit();
    }
}

debug();
