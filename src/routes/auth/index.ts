import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import { createTokens, getAccountActivationToken } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema.validator';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import Global from '../../global';

const router = express.Router();

router.post(
    '/login',
    validator(schema.userCredential),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findByEmail(req.body.email);
        if (!user) throw new BadRequestError(Global.USER_NOT_REGISTERED);
        if (!user.password) throw new BadRequestError(Global.CRED_NOT_SET);

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) throw new AuthFailureError(Global.AUTH_FAILURE);

        const tokens = await createTokens(user);

        new SuccessResponse(Global.LOGIN_SUCCESS, {
            user: _.pick(user, ['id', 'name', 'email']),
            tokens: tokens,
        }).send(res);
    }),
);

router.post(
    '/signup',
    validator(schema.signup),
    asyncHandler(async (req: any, res) => {
        console.log("-------req.body----------------------",req.body);
        const user = await UserRepo.findByEmail(req.body.email);
        if (user) throw new BadRequestError(Global.USER_ALREADY_REGISTERED);
        const createdUser = await UserRepo.create({
            name: req.body.name,
            email: req.body.email,
            dob: new Date(req.body.dob)
        });
        const tokens = await createTokens(createdUser);
        console.log("-------tokens----------------------",tokens);
        const accountActivationTokens = await getAccountActivationToken(createdUser);
        console.log("-------accountActivationTokens----------------------",accountActivationTokens);
        console.log("-------createdUser----------------------",createdUser);
        new SuccessResponse(Global.SIGNUP_SUCCESS, {
            user: _.pick(createdUser, ['_id', 'name', 'email']),
            tokens: tokens,
            "account-actiation-url": req.protocol + '://' + req.get('host') + '/auth/account-activation/' + accountActivationTokens
        }).send(res);
        console.log("-----------------------------",);
    }),
);

router.post(
    '/account-activation/:token',
    validator(schema.activation),
    asyncHandler(async (req: any, res) => {
        const user = await UserRepo.findByToken(req.params.token);
        if (!user) throw new BadRequestError(Global.INVALID_ACCOUNT_TOKEN);
        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(req.body.password, salt);
        await UserRepo.activateAccount(user, password);
        new SuccessResponse(Global.ACCOUNT_SUCCESS, {
        }).send(res);
    })
)

router.post(
    '/reset-password',
    validator(schema.resetPassword),
    asyncHandler(async (req: any, res) => {
        const user = await UserRepo.findByEmail(req.body.email);
        if (!user) {
            throw Error(Global.USER_NOT_FOUND);
        }
        if (!user.active) {
            throw Error(Global.USER_NOT_ACTIVE);
        }
        const resetPasswordTokens = await getAccountActivationToken(user);

        new SuccessResponse(Global.RESET_SUCCESS, {
            user: _.pick(user, ['_id', 'name', 'email']),
            "reset-password-url": req.protocol + '://' + req.get('host') + req.originalUrl + '/reset-password/' + resetPasswordTokens
        }).send(res);
    })

);
router.post(
    '/update-password/:token',
    validator(schema.updatePassword),
    asyncHandler(async (req: any, res) => {
        const user = await UserRepo.findByToken(req.params.token);
        if (!user) throw new BadRequestError(Global.INVALID_ACCOUNT_TOKEN);
        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(req.body.password, salt);
        await UserRepo.activateAccount(user, password);
        new SuccessResponse(Global.PASSWORD_SUCCESS, {
        }).send(res);
    })
)

export default router;
