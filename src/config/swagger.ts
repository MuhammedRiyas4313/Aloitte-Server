import swaggerJsdoc from 'swagger-jsdoc';
import { Config } from './index'; // adjust path if needed

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'API documentation for the ecommerce backend',
        },
        servers: [
            {
                url: `${Config.BASE_URL}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'access_token',
                },
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },

    apis: [
        './src/routes/*.ts', // all route files
        './src/controllers/*.ts',
    ],
};

export const swaggerSpec = swaggerJsdoc(options);
