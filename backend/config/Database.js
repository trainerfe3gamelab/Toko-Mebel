import { Sequelize } from "sequelize";

const db = new Sequelize('toko_online', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})

export default db;