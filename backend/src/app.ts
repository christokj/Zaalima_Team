import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import apiRouter from './routes/index';
import { ENV } from './config/env';
import helmet from 'helmet';
import limiter from './utils/limiter';
import webhookRoutes from './routes/v1/webhookRoutes';

dotenv.config();

if (!ENV.PORT) {
    throw new Error('PORT is not defined in environment variables.');
}


const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
    origin: [ENV.VITE_SERVER],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials (cookies, etc.)
}));

app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use('/api', webhookRoutes);

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api", apiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

export default app;
