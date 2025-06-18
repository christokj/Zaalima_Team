import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { ENV } from '../config/env';

// Extend Request to include `user`
interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: "No token provided" });
        return; // Return without returning the response itself
    }

    try {
        const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] });
        req.user = decoded;
        next(); // this returns void
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({ success: false, message: "Token expired" });
        } else {
            res.status(403).json({ success: false, message: "Invalid token" });
        }
        return; // Also end here with just a `return`
    }
};


export default authenticate;
