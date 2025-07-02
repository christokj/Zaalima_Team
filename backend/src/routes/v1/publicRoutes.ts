import express, { Router } from 'express';
import multer from 'multer';
import asyncHandler from '../../utils/asyncHandler';
import { signUp, login, refreshToken, logout, deleteImage, getProducts, createCheckoutSession, addToCart, getCart, deleteCartItem, getCategories, getCartCount, uploadDesignImage, createDesignOrder, createCustomDesignCheckoutSession, stripeWebhook } from '../../controllers/publicController';
import authenticate from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { signUpSchema } from '../../validations/signUpValidation';

const router: Router = express.Router();
const storage = multer.memoryStorage(); // store in RAM
const upload = multer({ storage });

router.post('/signup', validate(signUpSchema), asyncHandler(signUp));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/refresh', asyncHandler(refreshToken));
router.get('/getProducts', asyncHandler(getProducts));
router.delete('/deleteImage', authenticate, asyncHandler(deleteImage));
router.post('/create-checkout-session', authenticate, asyncHandler(createCheckoutSession))
router.post('/add-to-cart', authenticate, asyncHandler(addToCart))
router.get('/cart', authenticate, asyncHandler(getCart));
router.delete('/cart/:productId', authenticate, asyncHandler(deleteCartItem));
// router.get('/categories', asyncHandler(getCategories));
router.get('/cart', authenticate, asyncHandler(getCartCount));
router.post('/upload-design', upload.single('image'), asyncHandler(uploadDesignImage));
router.post('/design-orders', authenticate, asyncHandler(createDesignOrder));
router.post("/custom-design-checkout-session", authenticate, asyncHandler(createCustomDesignCheckoutSession));
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
