
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload & { userId: string };
}

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: "Please login" });
        return;
    }

    try {
        const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as JwtPayload & { userId: string };
        req.user = decoded;
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({ success: false, message: "Token expired" });
        } else {
            res.status(403).json({ success: false, message: "Invalid token" });
        }
    }
};

export default authenticate;
