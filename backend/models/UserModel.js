import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const { DataTypes } = Sequelize;

const tbl_users = db.define('tbl_users', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.INTEGER
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    name: {
        type: DataTypes.STRING
    },
    img_url: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
    archived: {
        type: DataTypes.TINYINT
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true
});

export default tbl_users;
