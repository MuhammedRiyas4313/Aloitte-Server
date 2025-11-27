import createHttpError from 'http-errors';
import { registerUserData } from '../types';
import User from '../models/User';
import bcrypt from 'bcrypt';

export class UserService {
    async createUser({ username, email, password, role }: registerUserData) {
        const userExist = await User.findOne({
            where: { email: email },
        });
        if (userExist) {
            const error = createHttpError(400, 'Email Already Exist');
            throw error;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await User.create({
                username,
                email,
                password: hashedPassword,
                role,
            });
        } catch {
            const error = createHttpError(500, 'Error while saving data to the database');
            throw error;
        }
    }
}
