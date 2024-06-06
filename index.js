import express from "express";
import cors from "cors";
import session from "express-session";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

const initializeApp = async () => {
    try {
        await db.authenticate();
        console.log('Database connected...');

        // Sinkronisasi semua model
        // await db.sync({ alter: true });
        // console.log('Database synced...');

        // Sinkronisasi store session
        // await store.sync();
        // console.log('Session store synced...');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

initializeApp();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto',
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT, () => {
    console.log('Server up dan running...');
});
