import express, { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import authenticate from '../middleware/authenticate';
import { CartController } from '../controller/CartController';
import { CartService } from '../services/cartService';
import { addToCartValidator } from '../validators/cart/addToCart-validator';

const router = express.Router();

const cartService = new CartService();
const cartController = new CartController(logger, cartService);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         productId:
 *           type: number
 *           example: 5
 *         quantity:
 *           type: number
 *           example: 2
 *         PriceAtAdd:
 *           type: number
 *           example: 79999
 *         userId:
 *           type: number
 *           example: 1
 *
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         userId:
 *           type: number
 *           example: 1
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         count:
 *           type: number
 *           example: 3
 *
 *     AddToCartRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - PriceAtAdd
 *       properties:
 *         productId:
 *           type: number
 *           example: 5
 *         quantity:
 *           type: number
 *           example: 2
 *         PriceAtAdd:
 *           type: number
 *           example: 79999
 *
 *   parameters:
 *     CartIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: number
 *       description: Cart item ID
 *
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Item added to cart successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart/{id}:
 *   post:
 *     summary: Remove an item from cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CartIdParam'
 *     responses:
 *       201:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Item removed from cart successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */

router.post(
    '/',
    authenticate,
    addToCartValidator,
    (req: Request, res: Response, next: NextFunction) => cartController.addToCart(req, res, next)
);

router.post('/:id', authenticate, (req: Request, res: Response, next: NextFunction) =>
    cartController.removeFromCart(req, res, next)
);

router.get('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    cartController.getCart(req, res, next)
);

export default router;
