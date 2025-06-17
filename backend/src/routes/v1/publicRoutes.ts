import express, { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { signUp, login } from '../../controllers/publicController';

const router: Router = express.Router();

router.post('/signup', asyncHandler(signUp));
router.post('/login', asyncHandler(login));

export default router;
