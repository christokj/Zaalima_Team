import express, { Router } from 'express';
import multer from 'multer';
import asyncHandler from '../../utils/asyncHandler';
import { signUp, login, refreshToken, logout, uploadProduct, uploadImage, deleteProduct, deleteImage, getProducts } from '../../controllers/publicController';
import authenticate from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { signUpSchema } from '../../validations/signUpValidation';
import { productSchema } from '../../validations/productValidation';

const router: Router = express.Router();
const storage = multer.memoryStorage(); // store in RAM
const upload = multer({ storage });

router.post('/signup', validate(signUpSchema), asyncHandler(signUp));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/uploadImage', authenticate, upload.single('image'), asyncHandler(uploadImage));
router.post('/uploadProduct', authenticate, validate(productSchema), asyncHandler(uploadProduct));
router.get('/getProducts', authenticate, asyncHandler(getProducts));
router.delete('/product/:id', authenticate, deleteProduct);
router.delete('/deleteImage', authenticate, deleteImage);

export default router;
