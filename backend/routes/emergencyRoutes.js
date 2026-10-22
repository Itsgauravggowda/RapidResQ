
import { Router } from 'express';
import pool from '../config/db.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const {
            patient_latitude,
            patient_longitude,
            emergency_category,
            required_facilities = null
        } = req.body;

        if (
            patient_latitude === undefined ||
            patient_longitude === undefined ||
            typeof patient_latitude !== 'number' ||
            typeof patient_longitude !== 'number' ||
            !Number.isFinite(patient_latitude) ||
            !Number.isFinite(patient_longitude) ||
            patient_latitude < -90 ||
            patient_latitude > 90 ||
            patient_longitude < -180 ||
            patient_longitude > 180
        ) {
            throw new ApiError(
                400,
                'Valid numeric patient latitude and longitude are required'
            );
        }

        if (
            typeof emergency_category !== 'string' ||
            emergency_category.trim().length === 0 ||
            emergency_category.trim().length > 50
        ) {
            throw new ApiError(
                400,
                'Emergency category must be a non-empty string of at most 50 characters'
            );
        }

        if (
            required_facilities !== null &&
            (
                !Array.isArray(required_facilities) ||
                !required_facilities.every(
                    facility =>
                        typeof facility === 'string' &&
                        facility.trim().length > 0
                )
            )
        ) {
            throw new ApiError(
                400,
                'Required facilities must be an array of non-empty strings or null'
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO emergencies
                (
                    patient_latitude,
                    patient_longitude,
                    emergency_category,
                    required_facilities
                )
             VALUES (?, ?, ?, ?)`,
            [
                patient_latitude,
                patient_longitude,
                emergency_category.trim(),
                required_facilities === null
                    ? null
                    : JSON.stringify(required_facilities)
            ]
        );

        const [rows] = await pool.execute(
            `SELECT
                emergency_id,
                patient_latitude,
                patient_longitude,
                emergency_category,
                required_facilities,
                status,
                created_at
             FROM emergencies
             WHERE emergency_id = ?`,
            [result.insertId]
        );

        const response = new ApiResponse(
            201,
            'Emergency created successfully',
            rows[0]
        );

        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
