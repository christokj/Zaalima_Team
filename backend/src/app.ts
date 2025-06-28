import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import apiRouter from './routes/index';
import { ENV } from './config/env';
import helmet from 'helmet';
import limiter from './utils/limiter';
// import webhookRoutes from './routes/v1/webhookRoutes';

dotenv.config();

if (!ENV.PORT) {
    throw new Error('PORT is not defined in environment variables.');
}

const app = express();

// For Vercel to trust proxy headers like X-Forwarded-For
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS config
app.use(cors({
    origin: [ENV.VITE_SERVER], // frontend URL (e.g., "https://zaalima-shop.vercel.app")
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Core middleware
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

// Optional webhook routes
// app.use('/api', webhookRoutes);

// Connect DB
connectDB();

// Root route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// Main API route
app.use("/api", apiRouter);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err.stack || err);
    res.status(500).json({ error: 'Something went wrong' });
});

export default app;
