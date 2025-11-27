import createHttpError from 'http-errors';
import { Cart, Product } from '../models';
import { CartData } from '../types';

export class CartService {
    async addCart({ quantity, PriceAtAdd, productId, userId }: CartData) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) throw createHttpError(404, 'Product not found');

            const existing = await Cart.findOne({ where: { userId, productId } });

            if (existing) {
                existing.quantity += quantity;
                await existing.save();
                return existing;
            }

            return await Cart.create({
                userId,
                productId,
                quantity,
                PriceAtAdd,
            });
        } catch (err) {
            console.error('cart update error:', err);
            const error = createHttpError(500, 'Error while saving data to the database');
            throw error;
        }
    }

    async getCart(userId: number) {
        try {
            return await Cart.findAndCountAll({
                where: {
                    userId,
                },
                include: [
                    {
                        model: Product,
                    },
                ],
            });
        } catch (err) {
            console.error('cart listing error:', err);
            const error = createHttpError(500, 'Error while fetching data from the database');
            throw error;
        }
    }

    async removeCart(userId: number, cartId: number) {
        try {
            const cart = await Cart.findOne({ where: { userId, id: cartId } });

            if (!cart) {
                throw createHttpError(404, 'Cart not found');
            }

            await cart.destroy();
        } catch (err) {
            console.error('cart removing error:', err);
            const error = createHttpError(500, 'Error while removing cart from the database');
            throw error;
        }
    }
}
