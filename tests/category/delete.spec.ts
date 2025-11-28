import request from 'supertest';
import app from '../../src/app';
import { sequelize } from '../../src/config/db';
import { Category, User } from '../../src/models';
import jwt from 'jsonwebtoken';
import { roles } from '../../src/constants';
// import { Sequelize } from 'sequelize'

describe('POST /category/:{id}', () => {
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
            const catData = { name: 'Updated Name', description: 'Updated Desc' };

            await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send(catData);

            const response = await request(app)
                .delete('/category/1')
                .set('Cookie', [`access_token=${access_token}`]);

            expect(response.statusCode).toBe(200);
        });

        it('should delete category in database', async () => {
            const CreatecatData = { name: 'Name', description: 'Desc' };

            await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send(CreatecatData);

            await request(app)
                .delete('/category/1')
                .set('Cookie', [`access_token=${access_token}`]);

            const category = await Category.findAll();

            expect(category).toHaveLength(0);
        });

        it('should return valid json response', async () => {
            const CreatecatData = { name: 'Name', description: 'Desc' };

            await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send(CreatecatData);

            const response = await request(app)
                .delete('/category/1')
                .set('Cookie', [`access_token=${access_token}`]);

            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        it('it should return 401  if the user is not authenticated', async () => {
            const CreatecatData = { name: 'Name', description: 'Desc' };

            await request(app)
                .post('/category')
                .set('Cookie', [`access_token=${access_token}`])
                .send(CreatecatData);

            const response = await request(app).delete('/category/1');

            expect(response.status).toBe(401);
        });
    });
});
