import express, { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import authenticate from '../middleware/authenticate';
import { OrderController } from '../controller/OrderController';
import { OrderService } from '../services/orderService';

const router = express.Router();

const orderService = new OrderService();
const orderController = new OrderController(orderService, logger);

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 10
 *         productId:
 *           type: number
 *           example: 5
 *         quantity:
 *           type: number
 *           example: 2
 *         priceAtPurchase:
 *           type: number
 *           example: 79999
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 3
 *         userId:
 *           type: number
 *           example: 22
 *         totalPrice:
 *           type: number
 *           example: 159998
 *         status:
 *           type: string
 *           example: "PLACED"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Place a new order for current user
 *     tags: [Order]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 3
 *                 message:
 *                   type: string
 *                   example: Order placed successfully
 *       400:
 *         description: Cart is empty or validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get current user's order history
 *     tags: [Order]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of orders for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */

router.post('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    orderController.placeOrder(req, res, next)
);

router.get('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    orderController.getOrderHistory(req, res, next)
);

export default router;
