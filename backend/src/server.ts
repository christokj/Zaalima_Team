import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import apiRouter from './routes/index';
import { ENV } from './config/env';
import helmet from 'helmet';

// Load environment variables
dotenv.config();

// Validate PORT exists
if (!ENV.PORT) {
    throw new Error('PORT is not defined in environment variables.');
}

// Initialize app
const app = express();

const allowedOrigin = ENV.VITE_SERVER; // Vite dev server

// Middlewares
app.use(helmet());
app.use(cors({
    origin: allowedOrigin,
    credentials: true, // ⬅️  For cookies/headers
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Basic route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// API routes
app.use("/api", apiRouter);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

// Start server
app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});
