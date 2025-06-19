import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const formattedErrors = result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            res.status(400).json({
                success: false,
                errors: formattedErrors,
            });
            return
        }

        // Replace req.body with parsed data (safe & validated)
        req.body = result.data;
        next();
    };
};
