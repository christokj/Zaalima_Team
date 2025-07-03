import { Express } from 'express';

declare global {
    namespace Express {
        interface Request {
            file?: Multer.File;
            files?: Multer.File[];

        }
    }
}