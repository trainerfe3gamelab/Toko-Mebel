import express from "express";
import {
    Login,
    logOut,
    Me,
    requestPasswordReset,
    resetPassword,
} from "../controllers/AuthController.js";

const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.delete('/logout', logOut);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword); // Ini adalah endpoint untuk POST request


export default router;
