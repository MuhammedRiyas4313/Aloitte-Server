import { NextFunction, Response } from 'express';
import { Logger } from 'winston';
import { roles } from '../constants';
import { UserService } from '../services/userService';
import { registerUserData, RequestRegisterUser } from '../types';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/tokenService';
import { validationResult } from 'express-validator';

export class AuthController {
    constructor(
        private logger: Logger,
        private userService: UserService,
        private tokenService: TokenService
    ) {}
    async registerUser(req: RequestRegisterUser, res: Response, next: NextFunction) {
        //field validation
        const result = validationResult(req);
        // console.log("validation result",result)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { username, email, password } = req.body;

        this.logger.debug('data recieved from request body', {
            username,
            email,
            password: '****',
        });
        try {
             
            const userCreated: registerUserData = await this.userService.createUser({
                username,
                email,
                password,
                role: roles.CUSTOMER,
            });
            // console.log("user created:",userCreated)
            this.logger.info('user registered successfully', {
                id: userCreated.id,
            });

            //create access token

            const payload: JwtPayload = {
                sub: String(userCreated.id),
                role: userCreated.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const refreshToken = this.tokenService.generateRefreshToken(payload);

            // //responses

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, //1 hour
            });

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
            });

            res.status(201).json({ id: userCreated.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
