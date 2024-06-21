import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};
