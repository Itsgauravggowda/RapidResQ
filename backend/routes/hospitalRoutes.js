
import { Router } from 'express';
import pool from '../config/db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const [hospitals] = await pool.query(`
            SELECT
                hospital_id,
                hospital_name,
                latitude,
                longitude,
                address,
                facilities,
                contact_number,
                is_active
            FROM hospitals
            ORDER BY hospital_id
        `);

        const response = new ApiResponse(
            200,
            'Hospitals retrieved successfully',
            hospitals
        );

        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
