import express, { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import { CategoryController } from '../controller/CategoryController';
import { CategoryService } from '../services/categoryService';
import authenticate from '../middleware/authenticate';
import canAccess from '../middleware/canAccess';
import { roles } from '../constants';
import { createCategoryValidator } from '../validators/category/createCategory-validator';
import { updateCategoryValidator } from '../validators/category/updateCategory-validator';
const router = express.Router();

const categoryService = new CategoryService();

const categoryController = new CategoryController(logger, categoryService);

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Electronics
 *         description:
 *           type: string
 *           example: Devices and gadgets
 *
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Electronics
 *         description:
 *           type: string
 *           example: Devices and gadgets
 *
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Updated Category Name
 *         description:
 *           type: string
 *           example: Updated description
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
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
 *                   example: Category created successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin access required)
 */

/**
 * @swagger
 * /category/{id}:
 *   patch:
 *     summary: Update an existing category
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Category updated successfully
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
 *                   example: Category updated successfully
 *       400:
 *         description: Validation Error
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *                   example: Category deleted successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 */

router.post(
    '/',
    authenticate,
    canAccess([roles.ADMIN]),
    createCategoryValidator,
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.createCategory(req, res, next)
);

router.patch(
    '/:id',
    authenticate,
    canAccess([roles.ADMIN]),
    updateCategoryValidator,
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.updateCategory(req, res, next)
);

router.delete(
    '/:id',
    authenticate,
    canAccess([roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.deleteCategory(req, res, next)
);

router.get('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    categoryController.getCategoryList(req, res, next)
);

export default router;
