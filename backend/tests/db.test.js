import 'dotenv/config';
import pool from '../config/db.js';

async function testDatabaseConnection() {
    try {
        const [rows] = await pool.query(
            'SELECT DATABASE() AS database_name, VERSION() AS mysql_version'
        );

        console.log('Database connection successful!');
        console.log(rows[0]);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testDatabaseConnection();