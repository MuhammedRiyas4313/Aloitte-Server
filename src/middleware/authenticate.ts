import { expressjwt } from 'express-jwt';
import { Config } from '../config';
import { Request } from 'express';
import { AuthCookie } from '../types';

export default expressjwt({
    secret: Config.ACEESS_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.split(' ')[1] !== undefined) {
            const token = authHeader.split(' ')[1];

            if (token) {
                return token;
            }
        }
        // console.log("req.cookies",req.cookies)
        const { access_token } = req.cookies as AuthCookie;

        // console.log("access_token",access_token)

        return access_token;
    },
});
