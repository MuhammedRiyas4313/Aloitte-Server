import request from 'supertest';
import app from '../../src/app';
import { sequelize } from '../../src/config/db';
import { Category, User } from '../../src/models';
import jwt from 'jsonwebtoken';
import { roles } from '../../src/constants';
import path from 'path';
// import { Sequelize } from 'sequelize'

describe('POST /product/', () => {
    let access_token: string;
    beforeAll(async () => {
        try {
            await sequelize.authenticate();

            access_token = jwt.sign(
                { sub: 10, role: roles.ADMIN },
                process.env.ACEESS_TOKEN_SECRET || 'test-secret',
                { expiresIn: '1h' }
            );

            //   await sequalize.sy
        } catch (error) {
            console.error('Database init error:', error);
            throw error; // stop tests if DB fails
        }
    });

    beforeEach(async () => {
        //database truncate //clean database before each test cases
        // await sequelize.drop();
        // await sequelize.truncate({ cascade: true });
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('Given all fields', () => {
        it('it should return 201 status code', async () => {
            const testImagePath = path.join(__dirname, '../assets/Capture001.png');
            const catRes = await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send({ name: 'Electronics', description: 'Phones' });

            const categoryId = catRes.body.id;

            const response = await request(app)
                .post('/product')
                .set('Cookie', [`access_token=${access_token}`])
                .field('name', 'Phone X')
                .field('description', 'Smartphone')
                .field('price', 999)
                .field('stock', 10)
                .field('categoryId', categoryId)
                .attach('product', testImagePath);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBeDefined();
        });

        it('should return valid json response', async () => {
            const testImagePath = path.join(__dirname, '../assets/Capture001.png');
            const catRes = await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send({ name: 'Electronics', description: 'Phones' });

            const categoryId = catRes.body.id;

            const response = await request(app)
                .post('/product')
                .set('Cookie', [`access_token=${access_token}`])
                .field('name', 'Phone X')
                .field('description', 'Smartphone')
                .field('price', 999)
                .field('stock', 10)
                .field('categoryId', categoryId)
                .attach('product', testImagePath);

            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        it('it should return 401  if the user is not authenticated', async () => {
            const response = await request(app)
                .post('/product')
                .field('name', 'Phone X')
                .field('description', 'Smartphone')
                .field('price', 999)
                .field('stock', 10);

            expect(response.statusCode).toBe(401);
        });
    });
});
