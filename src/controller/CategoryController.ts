import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';
import { CategoryService } from '../services/categoryService';
import { CreateCategoryInput } from '../types';
import { validationResult } from 'express-validator';

export class CategoryController {
    constructor(
        private logger: Logger,
        private categoryService: CategoryService
    ) {}
    async createCategory(req: CreateCategoryInput, res: Response, next: NextFunction) {
        //validation

        const result = validationResult(req);
        // console.log("validation result",result)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, description } = req.body;

        this.logger.debug('data recieved from request body', {
            name,
            description,
        });

        try {
            const categoryCreated = await this.categoryService.create({ name, description });
            this.logger.info('Category created successfully', {
                id: categoryCreated.id,
            });

            res.status(201).json({
                id: categoryCreated.id,
                message: 'Category created successfully',
            });
        } catch (error) {
            next(error);
            return;
        }
    }

    async updateCategory(req: CreateCategoryInput, res: Response, next: NextFunction) {
        const result = validationResult(req);
        // console.log("validation result",result)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const categoryId = req.params.id;

        const { name, description } = req.body;

        try {
            await this.categoryService.update({ name, description }, Number(categoryId));
            this.logger.info('category updated successfully', {
                id: categoryId,
            });

            res.json({ id: categoryId, message: 'Category updated successfully' });
        } catch (error) {
            next(error);
            return;
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        //while delete category de;ete products  under category
        const categoryId = req.params.id;
        try {
            await this.categoryService.delete(Number(categoryId));
            this.logger.info('category deleted successfully', {
                id: categoryId,
            });

            res.json({ id: categoryId, message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
            return;
        }
    }

    async getCategoryList(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await this.categoryService.getList();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
            return;
        }
    }
}
