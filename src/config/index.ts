import { config } from 'dotenv';
import path from 'path';

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const {
    PORT,
    NODE_ENV,
    CORS_ORIGIN,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    ACEESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    BASE_URL,
} = process.env;

export const Config = {
    BASE_URL,
    PORT,
    NODE_ENV,
    CORS_ORIGIN,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    ACEESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
};
