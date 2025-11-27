import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';
import { AuthUser, RequestCartInput } from '../types';
import { CartService } from '../services/cartService';
import { validationResult } from 'express-validator';

export class CartController {
    constructor(
        private logger: Logger,
        private cartService: CartService
    ) {}
    async addToCart(req: RequestCartInput, res: Response, next: NextFunction) {
        // const productId=req.params.id

        const result = validationResult(req);
        // console.log("validation result",result)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const _req = req as AuthUser;
        const userId = Number(_req.auth.sub);

        const { PriceAtAdd, productId, quantity } = req.body;

        try {
            const cart = await this.cartService.addCart({
                quantity,
                PriceAtAdd,
                productId,
                userId,
            });
            this.logger.info('item added to cart successfully', { id: cart.id });

            res.status(201).json({ id: cart.id, message: 'Item added to cart successfully' });
        } catch (error) {
            next(error);
            return;
        }
    }

    async getCart(req: Request, res: Response, next: NextFunction) {
        const _req = req as AuthUser;
        const userId = Number(_req.auth.sub);

        try {
            const cart = await this.cartService.getCart(userId);
            this.logger.info('cart fetch successfully', { count: cart.count });

            res.status(201).json(cart);
        } catch (error) {
            next(error);
            return;
        }
    }

    async removeFromCart(req: Request, res: Response, next: NextFunction) {
        const _req = req as AuthUser;
        const userId = Number(_req.auth.sub);

        const cartId = req.params.id;

        try {
            await this.cartService.removeCart(userId, Number(cartId));
            this.logger.info('item removed from cart successfully', { id: cartId });

            res.status(201).json({ id: cartId, message: 'Item removed from cart successfully' });
        } catch (error) {
            next(error);
            return;
        }
    }
}
