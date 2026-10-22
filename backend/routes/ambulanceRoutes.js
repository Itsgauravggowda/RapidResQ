
import { Router } from 'express';
import pool from '../config/db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const [ambulances] = await pool.query(`
            SELECT
                ambulance_id,
                driver_name,
                registration_number,
                latitude,
                longitude,
                status,
                capabilities
            FROM ambulances
            ORDER BY ambulance_id
        `);

        const response = new ApiResponse(
            200,
            'Ambulances retrieved successfully',
            ambulances
        );

        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
