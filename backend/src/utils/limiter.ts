import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,  // Disable `X-RateLimit-*` headers
});

export default limiter;
