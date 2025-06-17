import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import apiRouter from './routes/index'; // Adjust this import path based on your router file
import { ENV } from './config/env';

// Load environment variables
dotenv.config();

// Validate PORT exists
// const PORT = process.env.PORT ? parseInt(process.env.PORT) : null;
if (!ENV.PORT) {
    throw new Error('PORT is not defined in environment variables.');
}

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Basic route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// API routes
app.use("/api", apiRouter); // replace `apiRouter` with your actual router if named differently

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

// Start server
app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});
