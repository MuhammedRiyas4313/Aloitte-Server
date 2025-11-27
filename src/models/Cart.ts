import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Cart extends Model {
    declare id: number;
    declare productId: number;
    declare userId: number;
    declare quantity: number;
    declare PriceAtAdd: number;
}

Cart.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        PriceAtAdd: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        // Other model options go here
        sequelize,

        timestamps: true,

        // createdAt: true,

        // updatedAt: 'updateTimestamp',
        modelName: 'Cart',
    }
);

export default Cart;
