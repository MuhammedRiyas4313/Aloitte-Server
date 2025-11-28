import { checkSchema } from 'express-validator';

export const updateCategoryValidator = checkSchema({
    name: {
        in: ['body'],
        isString: {
            errorMessage: 'Category name must be a string',
        },
        notEmpty: {
            errorMessage: 'Category name is required',
        },
        trim: true,
    },

    description: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Description must be a string',
        },
        trim: true,
    },

    id: {
        in: ['params'],
        notEmpty: {
            errorMessage: 'Category ID is required',
        },
        isInt: {
            errorMessage: 'Category ID must be a valid integer',
        },
        toInt: true,
    },
});
