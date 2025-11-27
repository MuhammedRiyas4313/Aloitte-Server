import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Category extends Model {
    declare id: number;
    declare name: string;
    declare description: string;
}

Category.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        // Other model options go here
        sequelize,

        timestamps: true,

        createdAt: true,

        updatedAt: 'updateTimestamp',
        modelName: 'Category',
    }
);

export default Category;
