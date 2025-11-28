import { Config } from './config';
import logger from './config/logger';
import app from './app';
import { sequelize } from './config/db';
import User from './models/User';
import bcrypt from 'bcrypt';
import { roles } from './constants';
import './models';

const PORT = Config.PORT;

const adminUserCreate = async () => {
    try {
        const adminEmail: string = process.env.ADMIN_EMAIL || '';
        const adminPassword: string = process.env.ADMIN_PASSWORD || '';
        const adminUserName: string = process.env.ADMIN_USERNAME || '';

        const user = await User.findOne({
            where: { email: adminEmail },
        });
        if (user) {
            logger.info('admin with this email already created', {
                email: user.email,
            });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
        return await User.create({
            username: adminUserName,
            email: adminEmail,
            password: hashedPassword,
            role: roles.ADMIN,
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

const startServer = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Connection has been established successfully.');
        await adminUserCreate();
        if (Config.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                // console.log(`server is running on ${Config.PORT}`);
                logger.info('ecommerce server is running', { PORT });
            });
        }
    } catch (error) {
        console.log(error);
        logger.error('error while running server', { PORT });
        process.exit(1);
    }
};

void startServer();
