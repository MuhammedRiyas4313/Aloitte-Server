import request from 'supertest';
import app from '../../src/app';
import { sequelize } from '../../src/config/db';
import { Category, User } from '../../src/models';
import jwt from 'jsonwebtoken';
import { roles } from '../../src/constants';
// import { Sequelize } from 'sequelize'

describe('POST /category/', () => {
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
            const catData = { name: 'Updated Name', description: 'Updated Desc' };

            const response = await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send(catData);

            expect(response.statusCode).toBe(201);
        });

        it('should create a category in database', async () => {
            const catData = { name: 'Updated Name', description: 'Updated Desc' };

            const response = await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send(catData);

            const category = await Category.findAll();

            expect(category).toHaveLength(1);
            expect(response.statusCode).toBe(201);
        });

        it('should return valid json response', async () => {
            const catData = { name: 'Updated Name', description: 'Updated Desc' };

            const response = await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send(catData);

            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        it('it should return 401  if the user is not authenticated', async () => {
            const catData = { name: 'test', description: 'Updated Desc' };

            const response = await request(app).post('/category').send(catData);

            expect(response.statusCode).toBe(401);
        });
    });

    describe('Fields are missing', () => {
        it('it should return 400  if name is missing', async () => {
            const catData = { name: '', description: 'Updated Desc' };

            const response = await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send(catData);

            expect(response.statusCode).toBe(400);
        });
    });
});
