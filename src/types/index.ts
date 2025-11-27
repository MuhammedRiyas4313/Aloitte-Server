import { Request } from 'express';

export interface userData {
    username: string;
    email: string;
    password: string;
}

export interface CategoryBody {
    name: string;
    description?: string | undefined;
}

export interface userLoginData {
    email: string;
    password: string;
}
export interface RequestRegisterUser extends Request {
    body: userData;
}

export interface RequestLoginUser extends Request {
    body: userLoginData;
}

export interface CreateCategoryInput extends Request {
    body: CategoryBody;
}

export type registerUserData = {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: string;
};

export type CategoryInput = {
    name: string;
    description?: string | undefined;
};

export type AuthCookie = {
    access_token: string;
    refresh_token: string;
};

export interface AuthUser extends Request {
    auth: {
        sub: string;
        role: string;
    };
}
