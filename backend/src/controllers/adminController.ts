import bcrypt from 'bcryptjs';
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
mongoose.set('debug', true);

// Types for JWT payload
interface JwtPayload {
    userId: string | Types.ObjectId;
}


// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and Password are required' });
        return;
    }
    console.log(email, password)
    try {
        const user = await Admin.findOne({ email }).lean();
        console.log(user)
        if (!user) {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        const accessToken = jwt.sign({ userId: user._id }, ENV.ACCESS_TOKEN_SECRET, { expiresIn: '5m', algorithm: 'HS256' });
        const refreshToken = jwt.sign({ userId: user._id }, ENV.REFRESH_TOKEN_SECRET, { expiresIn: '1d', algorithm: 'HS256' });

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", refreshToken, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: isProduction, // Secure only in production
            sameSite: isProduction ? "none" : "lax", // 'None' for production, 'Lax' for development
        });

        res.status(200).json({ success: true, accessToken, email, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
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
        const skip = parseInt(req.query.skip as string) || 0;
        const limit = parseInt(req.query.limit as string) || 20;

        const products = await Product.find().skip(skip).limit(limit).lean();
        const total = await Product.countDocuments();

        res.json({ success: true, data: products, total });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
