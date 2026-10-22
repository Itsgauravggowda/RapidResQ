
import express from 'express';
import pool from './config/db.js';
import ApiResponse from './utils/ApiResponse.js';
import ApiError from './utils/ApiError.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json());

app.get('/api/health', async (req, res, next) => {
    try {
        await pool.query('SELECT 1');

        const response = new ApiResponse(
            200,
            'RapidResQ backend is running',
            { database: 'connected' }
        );

        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
});


app.use(errorMiddleware);

export default app;
