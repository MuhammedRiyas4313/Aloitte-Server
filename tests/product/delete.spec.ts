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
        it('it should return 200 status code', async () => {
            const testImagePath = path.join(__dirname, '../assets/Capture001.png');
            const catRes = await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send({ name: 'Electronics', description: 'Phones' });

            const categoryId = catRes.body.id;

            await request(app)
                .post('/product')
                .set('Cookie', [`access_token=${access_token}`])
                .field('name', 'Phone X')
                .field('description', 'Smartphone')
                .field('price', 999)
                .field('stock', 10)
                .field('categoryId', categoryId)
                .attach('product', testImagePath);

            const response = await request(app)
                .delete('/product/1')
                .set('Cookie', [`access_token=${access_token}`]);

            expect(response.statusCode).toBe(200);
        });
    });
});
