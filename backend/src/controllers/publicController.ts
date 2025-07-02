import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { ENV } from '../config/env';
import { Types } from 'mongoose';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import Product from '../models/Product';
import Stripe from 'stripe';
import { MulterRequest } from '../types/multerRequest';

import cache from '../utils/cache';

import { AuthenticatedRequest } from '../middleware/auth';

import mongoose from 'mongoose';
import Cart from '../models/Cart';
import DesignOrder from '../models/DesignOrder';
mongoose.set('debug', true);

// Types for JWT payload
interface JwtPayload {
    userId: string | Types.ObjectId;
}

// Signup
export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, age, mobile, password } = req.body;
        const existing = await User.findOne({ email }).lean();
        if (existing) {
            res.status(400).json({ success: false, message: 'Email already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, name, age, mobile, password: hashedPassword });
        try {
            const response = await newUser.save();
            // console.log('User saved:', response);
        } catch (err) {
            // console.error('Save error:', err);
            res.status(500).json({ success: false, message: 'Failed to save user' });
            return;
        }


        res.status(201).json({ success: true, message: 'Account created successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and Password are required' });
        return;
    }
    try {
        const user = await User.findOne({ email }).lean();
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

        res.status(200).json({ success: true, accessToken, email, role: "consumer", message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        res.status(401).json({ success: false, message: 'Please login' });
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-05-28.basil",
});

interface CartItem {
    productId: string;
    quantity: number;
}

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { cartItems }: { cartItems: CartItem[] } = req.body;

        if (!cartItems || !Array.isArray(cartItems)) {
            res.status(400).json({ message: "Invalid cart items" });
            return
        }

        const lineItems = await Promise.all(
            cartItems.map(async ({ productId, quantity }) => {
                const product = await Product.findById(productId);

                if (!product) {
                    throw new Error(`Product not found with ID: ${productId}`);
                }

                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.title,
                            images: [product.photoUrl],
                        },
                        unit_amount: product.price * 100,
                    },
                    quantity,
                };
            })
        );

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.VITE_SERVER}/success`,
            cancel_url: `${process.env.VITE_SERVER}/cancel`,
        });

        res.status(200).json({ sessionId: session.id });
        return
    } catch (err: any) {
        console.error("Stripe error:", err);
        res.status(500).json({ message: "Payment error", error: err.message });
        return
    }
};



export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { productId, quantity } = req.body;

        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return
        }

        const userId = req.user.userId;

        const cartItem = new Cart({ userId, productId, quantity });
        await cartItem.save();

        res.status(200).json({ success: true, message: "Item added to cart" });
    } catch (err) {
        console.error("Cart error:", err);
        res.status(500).json({ success: false, message: "Failed to add to cart", error: err });
    }
};

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.user as { userId: string };

        const cartItems = await Cart.find({ userId }).populate('productId')
            .populate("productId") // 🔥 important
            .sort({ createdAt: -1 });

        res.status(200).json({ cart: cartItems });
    } catch (err) {
        console.error("Cart fetch error:", err);
        res.status(500).json({ success: false, message: "Failed to load cart" });
    }
};
export const deleteCartItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.user as { userId: string };
        const { itemId } = req.params;

        await Cart.findOneAndDelete({ _id: itemId, userId });

        res.status(200).json({ success: true, message: "Item removed from cart" });
    } catch (err) {
        console.error("Cart delete error:", err);
        res.status(500).json({ success: false, message: "Failed to remove item from cart" });
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

export const getCartCount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        const count = await Cart.countDocuments({ userId });

        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch cart count", error });
        return
    }
};

export const uploadDesignImage = async (req: Request, res: Response) => {
    const multerReq = req as MulterRequest;

    if (!multerReq.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return
    }

    const buffer = multerReq.file.buffer;

    const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'custom_designs' },
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });
    };

    try {
        const result = await uploadFromBuffer();
        res.status(200).json({ success: true, imageUrl: (result as any).secure_url });
        return
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
    }
};

export const createDesignOrder = async (req: Request, res: Response) => {
    try {
        const { customerName, apparel, size, designImageUrl, position, scale } = req.body;

        const newOrder = new DesignOrder({
            customerName,
            apparel,
            size,
            designImageUrl,
            position,
            scale,
        });

        await newOrder.save();

        res.status(201).json({ success: true, data: newOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Order creation failed' });
    }
};

export const createCustomDesignCheckoutSession = async (req: Request, res: Response) => {
    const {
        apparel,
        designImageUrl,
        previewUrl,
        customerName,
        size,
        position,
        scale,
    } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${apparel} Custom Design`,
                            images: [designImageUrl],
                        },
                        unit_amount: 2999, // $29.99 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            metadata: {
                apparel,
                designImageUrl,
                previewUrl,
                customerName,
                size,
                position: JSON.stringify(position),
                scale: String(scale),
                type: "custom-design",
            },
            success_url: `${process.env.VITE_SERVER}/success`,
            cancel_url: `${process.env.VITE_SERVER}/cancel`,
        });

        res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
        console.error("Stripe error:", err);
        res.status(500).json({ message: "Custom design checkout failed", error: err.message });
    }
};

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Webhook verification failed:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.type === "custom-design") {
            try {
                await DesignOrder.create({
                    apparel: session.metadata.apparel,
                    designImageUrl: session.metadata.designImageUrl,
                    previewUrl: session.metadata.previewUrl,
                    customerName: session.metadata.customerName,
                    size: session.metadata.size,
                    position: JSON.parse(session.metadata.position),
                    scale: Number(session.metadata.scale),
                });

                console.log("✅ Custom design order saved");
            } catch (err) {
                console.error("❌ Failed to save custom design order:", err);
            }
        }
    }

    res.status(200).json({ received: true });
};
