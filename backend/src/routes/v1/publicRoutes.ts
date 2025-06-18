import express, { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { signUp, login, refreshToken, logout, uploadProduct } from '../../controllers/publicController';
import authenticate from '../../middleware/auth';
import upload from '../../config/upload';

const router: Router = express.Router();

router.post('/signup', asyncHandler(signUp));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/upload', upload.single('photo'), asyncHandler(uploadProduct));

export default router;
