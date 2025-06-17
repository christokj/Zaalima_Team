import { Request, Response, NextFunction, RequestHandler } from 'express';

interface CustomError extends Error {
    status?: number;
    code?: string | number;
    details?: { context?: { message?: string }; message?: string }[];
}

const sendErrorResponse = async (err: CustomError, res: Response): Promise<void> => {
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        res.status(err.status || 500).json({
            status: err.status || 500,
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
    } else {
        if (err.status) {
            res.status(err.status).json({
                status: err.status,
                message: err.message,
                code: err.code,
            });
        } else {
            res.status(400).json({
                status: 400,
                message: err.details?.[0]?.context?.message || err.details?.[0]?.message || 'error',
            });
        }
    }
};

const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
    return async (req, res, next) => {
        console.log(`[${new Date().toISOString()}] - Request to ${req.method} ${req.originalUrl} started`);

        try {
            await fn(req, res, next);
            console.log(`[${new Date().toISOString()}] - Request to ${req.method} ${req.originalUrl} completed successfully`);
        } catch (err) {
            console.error(`[${new Date().toISOString()}] - Error in request to ${req.method} ${req.originalUrl}:`, err);
            await sendErrorResponse(err as CustomError, res);
            res.json({ success: false, message: 'Error', err }); // removed `return`
        }
    };
};

export default asyncHandler;
