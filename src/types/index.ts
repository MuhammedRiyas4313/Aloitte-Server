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

export interface ProductBody {
    name: string;
    description?: string | undefined;
    price: number;
    stock: number;
    categoryId: number;
}

export interface CartInput {
    quantity: number;
    PriceAtAdd: number;
    productId: number;
}

export interface ProductImage {
    product: Express.Multer.File[];
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

export interface ProductCreateInput extends Request {
    body: ProductBody;
}

export interface RequestCartInput extends Request {
    body: CartInput;
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

export type ProductInput = {
    name: string;
    description?: string | undefined;
    price: number;
    stock: number;
    categoryId: number;
    imageUrl: string;
};

export type CartData = {
    quantity: number;
    PriceAtAdd: number;
    productId: number;
    userId: number;
};
export interface AuthUser extends Request {
    auth: {
        sub: string;
        role: string;
    };
}
