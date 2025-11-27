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
}
