import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { ENV } from '../config/env';
import { Types } from 'mongoose';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import Product from '../models/Product';
import { productSchema } from '../validations/productValidation';
import { signUpSchema } from '../validations/signUpValidation';

// Types for JWT payload
interface JwtPayload {
    userId: string | Types.ObjectId;
}

// Signup
export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        // Zod validation
        const parsedData = signUpSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({
                success: false,
                message: parsedData.error.errors.map(err => err.message).join(', '),
            });
            return;
        }

        const { username, name, age, mobile, password } = parsedData.data;

        const existing = await User.findOne({ username }).lean();
        if (existing) {
            res.status(400).json({ success: false, message: 'Username already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, name, age, mobile, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ success: true, message: 'Account created successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ success: false, message: 'Username and password are required' });
        return;
    }
    try {
        const user = await User.findOne({ username }).lean();
        if (!user) {
            res.status(400).json({ success: false, message: 'Invalid username or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Invalid username or password' });
            return;
        }

        const accessToken = jwt.sign({ userId: user._id }, ENV.ACCESS_TOKEN_SECRET, { expiresIn: '5m', algorithm: 'HS256' });
        const refreshToken = jwt.sign({ userId: user._id }, ENV.REFRESH_TOKEN_SECRET, { expiresIn: '1d', algorithm: 'HS256' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ success: true, accessToken, username, message: 'Login successful' });
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
        const parsed = productSchema.safeParse({
            ...req.body,
            reviews: typeof req.body.reviews === 'string' ? JSON.parse(req.body.reviews) : req.body.reviews,
        });

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const productData = parsed.data;

        const product = new Product({
            ...productData,
        });

        await product.save();

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

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
    const { secureUrl } = req.body;

    if (!secureUrl) {
        res.status(400).json({ success: false, message: 'secureUrl is required' });
        return;
    }

    try {
        const publicId = extractPublicId(secureUrl);
        const result = await cloudinary.uploader.destroy(publicId);
        res.status(200).json({ success: true, message: 'Image deleted', result });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Image deletion failed', error: err });
    }
};

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

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete product', error: err });
    }
};