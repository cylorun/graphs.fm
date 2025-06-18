import rateLimit from "express-rate-limit";

const MESSAGE =  {
    status: 429,
        message: 'Too many requests. Please try again later.',
};

export const lowRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 10,
    message: MESSAGE
});
