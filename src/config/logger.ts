import winston from 'winston';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// For Vercel/serverless, use /tmp directory or just console
const logDir = isVercel ? '/tmp' : 'logs';

const transports: winston.transport[] = [
    // Console transport (always available)
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
];

// Only add file transports if NOT on Vercel
if (!isVercel) {
    transports.push(
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'combine.log'),
        })
    );
}

const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports,
});

export default logger;
