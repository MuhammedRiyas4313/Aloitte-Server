import express, { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import authenticate from '../middleware/authenticate';
import { CartController } from '../controller/CartController';
import { CartService } from '../services/cartService';

const router = express.Router();

const cartService = new CartService();
const cartController = new CartController(logger, cartService);

router.post('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    cartController.addToCart(req, res, next)
);

router.post('/:id', authenticate, (req: Request, res: Response, next: NextFunction) =>
    cartController.removeFromCart(req, res, next)
);

router.get('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    cartController.getCart(req, res, next)
);

export default router;
