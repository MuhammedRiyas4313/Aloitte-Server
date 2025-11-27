import express, { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import { CategoryController } from '../controller/CategoryController';
import { CategoryService } from '../services/categoryService';
import authenticate from '../middleware/authenticate';
import canAccess from '../middleware/canAccess';
const router = express.Router();

const categoryService = new CategoryService();

const categoryController = new CategoryController(logger, categoryService);

router.post(
    '/',
    authenticate,
    canAccess(['admin']),
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.createCategory(req, res, next)
);

router.patch(
    '/:id',
    authenticate,
    canAccess(['admin']),
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.updateCategory(req, res, next)
);

router.delete(
    '/:id',
    authenticate,
    canAccess(['admin']),
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.deleteCategory(req, res, next)
);

router.get('/', authenticate, (req: Request, res: Response, next: NextFunction) =>
    categoryController.getCategoryList(req, res, next)
);

export default router;
