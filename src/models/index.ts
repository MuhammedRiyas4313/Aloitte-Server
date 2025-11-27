import User from './User';
import Category from './Category';
import Product from './Product';
import Cart from './Cart';

//associations

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Cart, { foreignKey: 'productId' });
User.hasMany(Cart, { foreignKey: 'userId' });

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

export { User, Product, Category, Cart };
