import express from 'express';
import UserRepo from '../../database/repository/UserRepo';
import PreferenceRepo from '../../database/repository/PreferenceRepo';
import { AccessTokenError, AuthFailureError, TokenExpiredError } from '../../core/ApiError';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema.validator';
import asyncHandler from '../../helpers/asyncHandler';
const router = express.Router();
import { getAccessToken } from '../../auth/authUtils';
import { verify } from "jsonwebtoken";
import { jwt_secret } from '../../config';
import { SuccessResponse } from '../../core/ApiResponse';
import Global from '../../global';

router.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: any, res, next) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
      const payload: any = await verify(req.accessToken, jwt_secret);
      const user = await UserRepo.findById(payload.id);
      if (!user) throw new AuthFailureError(Global.USER_NOT_REGISTERED);
      if (!user.active) throw new AuthFailureError(Global.USER_NOT_ACTIVE);
      req.user = user;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  })
)

router.get(
  '/profile',
  asyncHandler(async (req: any, res) => {
    const user = await UserRepo.getUserProfile(req.user.id);
    new SuccessResponse(Global.USER_PROFILE, user).send(res);
  })
)

router.post(
  '/preference',
  asyncHandler(async (req: any, res) => {
    const prefernces = await PreferenceRepo.updateUserPreferences(req.body.preferences, req.user.id);
    new SuccessResponse(Global.PREFERENCE_UPDATE_SUCCESS, prefernces).send(res);
  })
)



export default router;
