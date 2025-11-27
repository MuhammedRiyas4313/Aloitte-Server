import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from '../controller/AuthController';
import logger from '../config/logger';
import { UserService } from '../services/userService';
import { TokenService } from '../services/tokenService';
import registerValidator from '../validators/auth/register-validator';
import { CredentialService } from '../services/credentialService';
import loginValidator from '../validators/auth/login-validator';
const router = express.Router();

const userService = new UserService();
const tokenService = new TokenService();
const credentialService = new CredentialService();
const authController = new AuthController(logger, userService, tokenService, credentialService);

router.post('/register', registerValidator, (req: Request, res: Response, next: NextFunction) =>
    authController.registerUser(req, res, next)
);

router.post('/login', loginValidator, (req: Request, res: Response, next: NextFunction) =>
    authController.loginUSer(req, res, next)
);

export default router;
