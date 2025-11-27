import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { Logger } from 'winston';
import { uploadOnCloudinary } from '../utils/cloudinary';
import { ProductCreateInput } from '../types';
import { ProductService } from '../services/productService';
import { Op, WhereOptions } from 'sequelize';
import { validationResult } from 'express-validator';

export class ProductController {
    constructor(
        private logger: Logger,
        private productService: ProductService
    ) {}

    async createProduct(req: ProductCreateInput, res: Response, next: NextFunction) {
        //add validation
        const result = validationResult(req);
        // console.log("validation result",result)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, description, price, stock, categoryId } = req.body;

        try {
            if (!req.files) {
                return next(createHttpError(400, 'Product image is required'));
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const productFiles = files['product'];

            if (!productFiles || productFiles.length === 0) {
                return next(createHttpError(400, 'Product image is required'));
            }

            const localImagePath = productFiles[0]!.path;

            const imageUrl = await uploadOnCloudinary(localImagePath);

            if (!imageUrl) {
                return next(createHttpError(500, 'Image upload failed'));
            }

            const product = await this.productService.create({
                name,
                description,
                price,
                stock,
                categoryId,
                imageUrl: imageUrl.url,
            });

            console.log(product);

            this.logger.info('product created successfully', {
                id: product.id,
            });

            res.status(201).json({ id: product.id, message: 'Product created successfully' });
        } catch (error) {
            next(error);
            return;
        }
    }

    async getProducts(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        // console.log("validation result",result)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { minPrice, maxPrice, categoryId, search, page = 1, limit = 10 } = req.query;

        const pageNumber = Number(page);
        const pageLimit = Number(limit);

        const offset = (pageNumber - 1) * pageLimit;

        try {
            const query: WhereOptions = {};

            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price[Op.gte] = Number(minPrice);
                if (maxPrice) query.price[Op.lte] = Number(maxPrice);
            }

            // Category filter
            if (categoryId) {
                query.categoryId = Number(categoryId);
            }

            // Search filter
            if (search) {
                query.name = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const products = await this.productService.getList(query, pageLimit, offset);
            res.status(200).json(products);
        } catch (error) {
            next(error);
            return;
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id;

            await this.productService.delete(Number(productId));

            this.logger.info('category deleted successfully', {
                id: productId,
            });
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: ProductCreateInput, res: Response, next: NextFunction) {
        const result = validationResult(req);
        // console.log("validation result",result)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const productId = req.params.id;
        console.log(req.body);
        console.log(req.body.name);

        const { name, description, price, stock, categoryId } = req.body;

        console.log(name, description, price, stock, categoryId);

        try {
            if (!req.files) {
                return next(createHttpError(400, 'Product image is required'));
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const productFiles = files['product'];

            if (!productFiles || productFiles.length === 0) {
                return next(createHttpError(400, 'Product image is required'));
            }

            const localImagePath = productFiles[0]!.path;

            const imageUrl = await uploadOnCloudinary(localImagePath);

            if (!imageUrl) {
                return next(createHttpError(500, 'Image upload failed'));
            }
            await this.productService.update(
                { name, description, price, stock, categoryId, imageUrl: imageUrl.urll },
                Number(productId)
            );

            this.logger.info('product updated successfully', {
                id: productId,
            });

            res.json({ id: productId, message: 'Product updated successfully' });
        } catch (error) {
            next(error);
            return;
        }
    }
}
