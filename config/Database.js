import { Sequelize } from "sequelize";

const db = new Sequelize('backend_cp', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})

export default db;