import request from 'supertest';
import app from '../../src/app';
import { sequelize } from '../../src/config/db';
import { User } from '../../src/models';
// import { Sequelize } from 'sequelize'

describe('POST auth/login', () => {
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
        it('should return 200 status code ', async () => {
            const registeruserData = {
                username: 'janna',
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };

            await request(app).post('/auth/register').send(registeruserData);

            const userData = {
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };

            const response = await request(app).post('/auth/login').send(userData);

            expect(response.statusCode).toBe(200);
        });
        it('should return valid json response', async () => {
            const registeruserData = {
                username: 'janna',
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };

            await request(app).post('/auth/register').send(registeruserData);

            const userData = {
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };
            const response = await request(app).post('/auth/login').send(userData);

            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });
        it('should return 400 if user with that email is not exist', async () => {
            const registeruserData = {
                username: 'janna',
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };

            await request(app).post('/auth/register').send(registeruserData);

            const userData = {
                email: 'jannak@gmail.com',
                password: 'janna123',
            };

            const response = await request(app).post('/auth/login').send(userData);

            expect(response.status).toBe(400);
        });

        it('should return if the password is not matching', async () => {
            const registeruserData = {
                username: 'janna',
                email: 'jannakondeth5@gmail.com',
                password: 'janna123',
            };

            await request(app).post('/auth/register').send(registeruserData);

            const userData = {
                email: 'jannakondeth5@gmail.com',
                password: 'janna1234',
            };

            const response = await request(app).post('/auth/login').send(userData);

            expect(response.status).toBe(400);
        });
    });

    describe('Missing Fields with 400', () => {
        it('should return 400 if email is missing', async () => {
            const userData = {
                email: '',
                password: 'janna123',
            };

            const response = await request(app).post('/auth/login').send(userData);
            expect(response.status).toBe(400);
        });
        it('should return 400 if password is missing', async () => {
            const userData = {
                email: 'jannakondeth5@gmail.com',
                password: '',
            };

            const response = await request(app).post('/auth/login').send(userData);
            expect(response.status).toBe(400);
        });
    });
});
