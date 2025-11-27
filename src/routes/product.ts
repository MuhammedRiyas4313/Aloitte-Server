import express, { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import authenticate from '../middleware/authenticate';
import canAccess from '../middleware/canAccess';
import { ProductController } from '../controller/ProductController';
import { upload } from '../middleware/multer';
import { ProductService } from '../services/productService';
import { roles } from '../constants';
import { createProductValidator } from '../validators/product/createProduct-validator';
import { updateProductValidator } from '../validators/product/updateProduct-validator';
import { productQueryValidator } from '../validators/product/productQuery-validator';

const router = express.Router();

const productService = new ProductService();

const productController = new ProductController(logger, productService);

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: iPhone 15
 *         description:
 *           type: string
 *           example: Latest Apple flagship phone
 *         price:
 *           type: number
 *           example: 79999
 *         stock:
 *           type: number
 *           example: 25
 *         categoryId:
 *           type: number
 *           example: 3
 *         imageUrl:
 *           type: string
 *           example: https://res.cloudinary.com/sample.jpg
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           example: iPhone 15
 *         description:
 *           type: string
 *           example: Apple smartphone with A16 Bionic
 *         price:
 *           type: number
 *           example: 79999
 *         stock:
 *           type: number
 *           example: 10
 *         categoryId:
 *           type: number
 *           example: 1
 *
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Updated Name
 *         description:
 *           type: string
 *           example: Updated Description
 *         price:
 *           type: number
 *           example: 99999
 *         stock:
 *           type: number
 *           example: 50
 *         categoryId:
 *           type: number
 *           example: 2
 *
 *   parameters:
 *     ProductIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: number
 *       description: Product ID
 *
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               product:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (max 5)
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               description:
 *                 type: string
 *                 example: Apple smartphone
 *               price:
 *                 type: number
 *                 example: 79999
 *               stock:
 *                 type: number
 *                 example: 10
 *               categoryId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 5
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *       400:
 *         description: Validation error / Image missing
 *       401:
 *         description: Unauthorized (No auth)
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: Update an existing product
 *     tags: [Product]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ProductIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload new product images
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               categoryId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 10
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ProductIdParam'
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get products with filtering, search & pagination
 *     tags: [Product]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         example: 1000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         example: 50000
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: number
 *         example: 3
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: iphone
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */

router.post(
    '/',
    authenticate,
    canAccess([roles.ADMIN]),
    upload.fields([
        {
            name: 'product',
            maxCount: 5,
        },
    ]),
    createProductValidator,
    (req: Request, res: Response, next: NextFunction) =>
        productController.createProduct(req, res, next)
);

router.patch(
    '/:id',
    authenticate,
    canAccess([roles.ADMIN]),
    upload.fields([
        {
            name: 'product',
            maxCount: 5,
        },
    ]),
    updateProductValidator,
    (req: Request, res: Response, next: NextFunction) =>
        productController.updateProduct(req, res, next)
);

router.delete(
    '/:id',
    authenticate,
    canAccess([roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        productController.deleteProduct(req, res, next)
);

router.get(
    '/',
    authenticate,
    productQueryValidator,
    (req: Request, res: Response, next: NextFunction) =>
        productController.getProducts(req, res, next)
);

export default router;
