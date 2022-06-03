import express from 'express';
import auth from './auth'
import user from './user';
import preference from './preference';

const router = express.Router();
router.use('/auth', auth);
router.use('/user', user);
router.use('/preference', preference);

export default router;
