import createHttpError from 'http-errors';
import { CategoryInput } from '../types';
import Category from '../models/Category';

export class CategoryService {
    async create({ name, description }: CategoryInput) {
        try {
            return await Category.create({
                name,
                description,
            });
        } catch {
            const error = createHttpError(500, 'Error while saving data to the database');
            throw error;
        }
    }

    async update({ name, description }: CategoryInput, categoryId: number) {
        try {
            // console.log('catid', categoryId);
            const category = await Category.findByPk(categoryId);
            // console.log(category);
            if (!category) {
                throw createHttpError(404, 'Category not found');
            }

            category.name = name ?? category.name;
            category.description = description ?? category.description;

            await category.save();

            return category;
        } catch (err) {
            console.error('Category update error:', err);
            const error = createHttpError(500, 'Error while saving data to the database');
            throw error;
        }
    }

    async delete(categoryId: number) {
        try {
            const category = await Category.findByPk(categoryId);
            // console.log(category);
            if (!category) {
                throw createHttpError(404, 'Category not found');
            }

            await category.destroy();
        } catch (err) {
            console.error('Category delete error:', err);
            const error = createHttpError(500, 'Error while deleting  category');
            throw error;
        }
    }

    async getList() {
        try {
            return await Category.findAll();
        } catch (err) {
            console.error('Category listing error:', err);
            const error = createHttpError(500, 'Error while listing  category');
            throw error;
        }
    }
}
