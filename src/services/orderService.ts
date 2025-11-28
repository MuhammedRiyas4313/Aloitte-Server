import createHttpError from 'http-errors';
import { Cart, Order, OrderItem, Product } from '../models';
import { where } from 'sequelize';

export class OrderService {
    async createOrder(userId: number) {
        try {
            const cart = await Cart.findAll({
                where: {
                    userId,
                },
            });

            if (cart.length === 0) {
                const error = createHttpError(400, 'Yor Cart is empty!please add product to order');
                throw error;
            }

            const totalPrice = cart.reduce((sum, item) => sum + item.PriceAtAdd * item.quantity, 0);

            const orderCreated = await Order.create({
                userId,
                totalPrice,
            });

            for (const item of cart) {
                await OrderItem.create({
                    orderId: orderCreated.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.PriceAtAdd,
                });

                //stock
                const productId = item.productId;
                const product = await Product.findByPk(productId);

                if (!product) {
                    throw createHttpError(400, 'Product not found');
                }
                if (product.stock < item.quantity) {
                    throw createHttpError(500, `Insufficient stock for product ,${product.name}`);
                }

                await Product.decrement({ stock: item.quantity }, { where: { id: productId } });
            }
            //clear cart

            await Cart.destroy({ where: { userId } });

            return orderCreated;
        } catch (err) {
            console.error('order place API error:', err);
            const error = createHttpError(500, 'Error while  place order');
            throw error;
        }
    }

    async getOrders(userId: number) {
        try {
            const orders = await Order.findAll({
                where: {
                    userId,
                },
                include: [
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product,
                            },
                        ],
                    },
                ],
            });

            return orders;
        } catch (err) {
            console.error('order history fetch API error:', err);
            const error = createHttpError(500, 'Error while  fetch orders');
            throw error;
        }
    }
}
