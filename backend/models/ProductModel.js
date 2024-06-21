// ProductModel.js

import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Category from './CategoryModel.js';
import User from './UserModel.js';

const { DataTypes } = Sequelize;

const Product = db.define('tbl_products', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    },
    archived: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    id_user: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img_url: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    id_category: {
        type: DataTypes.STRING,
        references: {
            model: Category,
            key: 'uuid'
        }
    },
    unit: {
        type: DataTypes.STRING
    },
    sku: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    }
}, {
    freezeTableName: true
});

// Definisi relasi dengan Category
Product.belongsTo(Category, { foreignKey: 'id_category' });


export default Product;
