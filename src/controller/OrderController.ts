import { NextFunction, Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { Logger } from 'winston';
import { AuthUser } from '../types';

export class OrderController {
    constructor(
        private orderService: OrderService,
        private logger: Logger
    ) {}
    async placeOrder(req: Request, res: Response, next: NextFunction) {
        const _req = req as AuthUser;
        const userId = Number(_req.auth.sub);

        try {
            const order = await this.orderService.createOrder(userId);

            this.logger.info('order placed successfully', { id: order.id });

            res.status(201).json({ id: order.id, message: 'Order placed successfully' });
        } catch (error) {
            next(error);
            return;
        }
    }

    async getOrderHistory(req: Request, res: Response, next: NextFunction) {
        const _req = req as AuthUser;
        const userId = Number(_req.auth.sub);

        try {
            const orders = await this.orderService.getOrders(userId);
            this.logger.info('order placed successfully');

            res.status(201).json(orders);
        } catch (error) {
            next(error);
            return;
        }
    }
}
