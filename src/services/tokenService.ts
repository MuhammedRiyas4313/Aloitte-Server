import { JwtPayload, sign } from 'jsonwebtoken';
import { Config } from '../config';

export class TokenService {
    constructor() {}
    generateAccessToken(payload: JwtPayload) {
        const accessToken = sign(payload, Config.ACEESS_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1m',
            issuer: 'ecom-server',
        });
        // console.log("accessToken",accessToken)
        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1y',
            issuer: 'ecom-server',
            jwtid: String(payload.id),
        });

        return refreshToken;
    }
}
