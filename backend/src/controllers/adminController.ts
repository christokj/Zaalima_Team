import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { ENV } from '../config/env';
import { Types } from 'mongoose';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import Product from '../models/Product';

import cache from '../utils/cache';

import { AuthenticatedRequest } from '../middleware/auth';

import mongoose from 'mongoose';
import Cart from '../models/Cart';
import Admin from '../models/AdminSchema';
import { z } from 'zod';
mongoose.set('debug', true);

// Types for JWT payload
interface JwtPayload {
    userId: string | Types.ObjectId;
}

// const signupSchema = z.object({
//     email: z.string().email('Invalid email format'),
//     password: z.string()
// });

// export const signup = async (req: Request, res: Response) => {
//     // Validate input with Zod
//     const validationResult = signupSchema.safeParse(req.body);

//     if (!validationResult.success) {
//         res.status(400).json({
//             success: false,
//             errors: validationResult.error.flatten().fieldErrors
//         });
//         return
//     }

//     const { email, password } = validationResult.data;

//     try {
//         // Check for existing admin
//         if (await Admin.findOne({ email })) {
//             res.status(409).json({
//                 success: false,
//                 message: 'Email already in use'
//             });
//             return;
//         }

//         // Create and save admin (auto-hashes password via schema pre-save hook)
//         const admin = await Admin.create({ email, password });

//         res.status(201).json({
//             success: true,
//             message: 'Admin created successfully',
//             email: admin.email
//             // Omit password hash automatically
//         });
//         return;

//     } catch (err) {
//         console.error('Signup error:', err);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//         return;
//     }
// };

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
    }

    try {
        // Find admin and explicitly select password
        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        // Compare passwords
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        // Create tokens (using admin._id, not user._id)
        const accessToken = jwt.sign(
            { userId: admin._id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '5m', algorithm: 'HS256' }
        );

        const refreshToken = jwt.sign(
            { userId: admin._id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '1d', algorithm: 'HS256' }
        );

        // Set cookie
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            success: true,
            accessToken,
            email: admin.email,
            role: 'admin',
            message: 'Login successful'
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        res.status(401).json({ success: false, message: 'No refresh token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as JwtPayload;
        const accessToken = jwt.sign({ userId: decoded.userId }, ENV.ACCESS_TOKEN_SECRET, { expiresIn: '5m', algorithm: 'HS256' });
        res.status(200).json({ success: true, accessToken });
    } catch (err) {
        res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({ success: true, message: 'Logout successful' });
};

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Get total number of users
        const totalUsers = await User.countDocuments();

        // Get total number of products
        const totalProducts = await Product.countDocuments();
        console.log('totalProducts:', totalProducts, 'totalUsers:', totalUsers);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
            }
        });
    }
    catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password').lean();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return
        }

        user.active = !user.active;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User has been ${user.active ? "activated" : "frozen"}`,
            active: user.active,
        });
    } catch (error) {
        console.error("Toggle user error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// Extend Request type
interface MulterRequest extends Request {
    file: Express.Multer.File;
}

export const uploadImage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const multerReq = req as MulterRequest;

    if (!multerReq.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
    }

    const buffer = multerReq.file.buffer;

    const streamUpload = () => {
        return new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'zaalima' },
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });
    };

    try {
        const result = await streamUpload();
        res.status(200).json({ success: true, imageUrl: result.secure_url });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error?.message || 'Unknown error',
        });
    }
};

export const uploadProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productData = req.body;

        const product = new Product({
            ...productData,
        });

        await product.save();
        cache.del('productList');
        res.status(200).json({ success: true, message: 'Product uploaded successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Upload failed' });
    }
};

function extractPublicId(secureUrl: string): string {
    const parts = secureUrl.split('/');
    const filename = parts.pop(); // e.g., abc123.jpg
    const folder = parts.pop();   // e.g., your_folder
    const nameOnly = filename?.replace(/\.[^/.]+$/, ''); // abc123
    return `${folder}/${nameOnly}`;
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).select('photoUrl').lean();;

        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }

        // Delete image from Cloudinary
        if (product.photoUrl) {
            const publicId = extractPublicId(product.photoUrl);
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete product from MongoDB
        await Product.findByIdAndDelete(id);
        cache.del('productList');
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete product', error: err });
    }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json({ success: true, categories });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch categories', error: err });
    }
}

export const getProducts = async (req: Request, res: Response) => {

    try {

        const products = await Product.find().lean();
        const total = await Product.countDocuments();

        res.json({ success: true, data: products, total });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        console.error('Get product error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
}
