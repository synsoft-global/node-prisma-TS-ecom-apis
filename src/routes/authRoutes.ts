import express, { Router } from 'express';
import * as authController from '../controllers/authController';
import schema from '../helpers/schema.validator';
import validator from '../helpers/validator';

const router = express.Router();

router.post('/login', validator(schema.userCredential), authController.login);
router.post('/signup', validator(schema.signup), authController.signup);
router.post('/account-activation/:token', validator(schema.activation), authController.activateAccount);
router.post('/reset-password', validator(schema.resetPassword), authController.resetPassword);
router.post('/update-password/:token', validator(schema.updatePassword), authController.updatePassword);

export default router;
