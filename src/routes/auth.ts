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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: janna
 *         email:
 *           type: string
 *           format: email
 *           example: janna@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: Password123
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 14
 *          message:
 *           type: string
 *           example: Registered successfully
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: janna@gmail.com
 *         password:
 *           type: string
 *           example: Password123
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 14
 *         message:
 *           type: string
 *           example: Logged in successfully
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully. Access & refresh tokens are set in cookies.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=xxx; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and set cookies (access & refresh tokens)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful. Cookies set.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=xxx; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 */

router.post('/register', registerValidator, (req: Request, res: Response, next: NextFunction) =>
    authController.registerUser(req, res, next)
);

router.post('/login', loginValidator, (req: Request, res: Response, next: NextFunction) =>
    authController.loginUSer(req, res, next)
);

export default router;
