import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { ENV } from '../config/env';
import { Types } from 'mongoose';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import Product from '../models/Product';

// Types for JWT payload
interface JwtPayload {
    userId: string | Types.ObjectId;
}

// Signup
export const signUp = async (req: Request, res: Response): Promise<void> => {
    const { username, name, age, mobile, password } = req.body;
    try {
        const existing = await User.findOne({ username });
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
    console.log("first ");
    try {
        const user = await User.findOne({ username });
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

export const uploadProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, price, category, rating, reviews } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }

        const result = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
        });

        const product = new Product({
            title,
            description,
            price: parseFloat(price),
            category,
            rating: parseFloat(rating),
            reviews: JSON.parse(reviews),
            photoUrl: result.secure_url,
        });

        await product.save();

        res.status(200).json({ success: true, message: 'Product uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Upload failed' });
    }
};
