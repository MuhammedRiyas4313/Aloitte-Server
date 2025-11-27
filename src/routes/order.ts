import express, { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import authenticate from '../middleware/authenticate';
import { OrderController } from '../controller/OrderController';
import { OrderService } from '../services/orderService';

const router = express.Router();

const orderService = new OrderService();
const orderController = new OrderController(orderService, logger);

router.post('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    orderController.placeOrder(req, res, next)
);

router.get('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    orderController.getOrderHistory(req, res, next)
);

export default router;
