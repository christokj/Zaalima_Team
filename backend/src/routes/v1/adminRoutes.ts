import express, { Router } from 'express';
import multer from 'multer';
import asyncHandler from '../../utils/asyncHandler';
import { login, refreshToken, logout, uploadProduct, uploadImage, deleteProduct, getProducts, getCategories, getDashboardStats, getAllUsers, toggleUserStatus, getProduct, getAllDesignOrders, updateDesignOrderStatus, addProduct, updateProduct } from '../../controllers/adminController';
import authenticate from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { productSchema } from '../../validations/productValidation';

const router: Router = express.Router();
const storage = multer.memoryStorage(); // store in RAM
const upload = multer({ storage });

// router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/refresh', asyncHandler(refreshToken));
router.get('/dashboard-stats', authenticate, asyncHandler(getDashboardStats));
router.get('/getAllUsers', authenticate, asyncHandler(getAllUsers));
router.put("/users/:id/toggle", authenticate, asyncHandler(toggleUserStatus));
router.get('/getProducts', authenticate, asyncHandler(getProducts));
router.get('/getProduct/:id', authenticate, asyncHandler(getProduct));
router.post('/uploadImage', authenticate, upload.single('image'), asyncHandler(uploadImage));
router.post('/uploadProduct', authenticate, validate(productSchema), asyncHandler(uploadProduct));
router.delete('/product/:id', authenticate, asyncHandler(deleteProduct));
router.get('/categories', authenticate, asyncHandler(getCategories));
router.get('/design-orders', authenticate, asyncHandler(getAllDesignOrders));
router.put('/design-orders/:orderId/status', authenticate, updateDesignOrderStatus);
router.post('/products', authenticate, addProduct);
router.put('/products/:id', authenticate, updateProduct);

export default router;
