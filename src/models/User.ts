import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class User extends Model {
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: 'admin' | 'customer';
}

User.init(
    {
        // Model attributes are defined here
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            // allowNull defaults to true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'customer'),
            allowNull: false,
        },
    },
    {
        // Other model options go here
        sequelize,

        timestamps: true,

        createdAt: true,

        updatedAt: 'updateTimestamp',
        modelName: 'User',
    }
);

// the defined model is the class itself
// console.log(User === sequelize.models.User); // true

export default User;
