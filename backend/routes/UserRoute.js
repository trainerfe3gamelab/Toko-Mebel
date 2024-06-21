import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateAdmin,
    deleteUser,
    createAdmin,
} from "../controllers/UsersController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, getUserById);
router.post('/users', createUser);
router.post('/admin/users', createAdmin);
router.patch('/users/:id', verifyUser, updateUser);
router.patch('/admin/users/:id', verifyUser, adminOnly, updateAdmin);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

export default router;

