import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from './config/logger';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Config } from './config';
import authRouter from '../src/routes/auth';
import categoryRouter from '../src/routes/category';
import productRouter from '../src/routes/product';
import cartRouter from '../src/routes/cart';

const app = express();

app.use(
    cors({
        origin: Config.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.static('public', { dotfiles: 'allow' }));
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);

//error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});

export default app;
