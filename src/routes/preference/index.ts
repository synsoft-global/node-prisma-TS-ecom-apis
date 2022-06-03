import express from 'express';
const router = express.Router();
import PreferenceRepo from '../../database/repository/PreferenceRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { SuccessResponse } from '../../core/ApiResponse';
import Global from '../../global';

router.get(
    '/',
    asyncHandler(async (req: any, res) => {
        const prefernces = await PreferenceRepo.getAllPreferences();
        new SuccessResponse(Global.PREFERENCE_LIST,prefernces).send(res);
    })
)

export default router;