import { Config } from '.';
import { Sequelize } from 'sequelize';

const database = Config.DB_NAME || '';
const username = Config.DB_USERNAME || '';
const password = Config.DB_PASSWORD;
const host = Config.DB_HOST || 'localhost';

export const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: 'postgres',
    logging: false,
    // ssl:{
    //     rej
    // },
    // pool:''
});
