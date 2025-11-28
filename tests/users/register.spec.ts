import request from 'supertest';
import app from '../../src/app';
import { sequelize } from '../../src/config/db';
import { User } from '../../src/models';
// import { Sequelize } from 'sequelize'

describe('POST auth/register', () => {
    beforeAll(async () => {
        try {
            await sequelize.authenticate();

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
        it('should return 201 status code', async () => {
            const userData = {
                username: 'janna',
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };

            const response = await request(app).post('/auth/register').send(userData);

            expect(response.status).toBe(201);
        });

        it('should return valid json response', async () => {
            const userData = {
                username: 'janna',
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };
            const response = await request(app).post('/auth/register').send(userData);

            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        it('it should persist the user in the database', async () => {
            const userData = {
                username: 'janna',
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };

            await request(app).post('/auth/register').send(userData);

            const users = await User.findAll();
            // console.log(users)
            expect(users).toHaveLength(1);
            expect(users[0]?.username).toBe(userData.username);
            expect(users[0]?.email).toBe(userData.email);
        });
    });

    describe('Missing Fields with 400', () => {
        it('should return 400 if email field is missing', async () => {
            const userData = {
                username: 'janna',
                email: '',
                password: 'janna123',
            };

            const response = await request(app).post('/auth/register').send(userData);

            const users = await User.findAll();

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect((response.body as Record<string, string>).errors?.length).toBeGreaterThan(0);

            expect(users).toHaveLength(0);
        });
        it('should return 400 if username field is missing', async () => {
            const userData = {
                username: '',
                email: 'janna@gmail.com',
                password: 'janna123',
            };

            const response = await request(app).post('/auth/register').send(userData);
            const users = await User.findAll();

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect((response.body as Record<string, string>).errors?.length).toBeGreaterThan(0);

            expect(users).toHaveLength(0);
        });

        it('should return 400 if password field is missing', async () => {
            const userData = {
                username: 'janna',
                email: 'jannakondeth5@gmail.com',
                password: '',
            };

            const response = await request(app).post('/auth/register').send(userData);

            const users = await User.findAll();

            expect(response.status).toBe(400);

            expect(users).toHaveLength(0);
        });
    });
});
