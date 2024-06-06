import User from "../models/UserModel.js";
import argon2 from "argon2";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // atau 465
    secure: false, // true untuk port 465, false untuk port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: "Email tidak ditemukan" });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Kirim token langsung ke email pengguna
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `Token reset password Anda: ${resetToken}`,
        };
        await transporter.sendMail(mailOptions);

        // Simpan token dan waktu kedaluwarsa token ke dalam database
        const resetTokenExpiry = Date.now() + 3600000; // 1 jam
        await user.update({
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpiry,
        });

        res.status(200).json({ msg: "Token reset password telah dikirim ke email" });
    } catch (error) {
        console.error("Error saat meminta reset password:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() },
            },
        });
        if (!user) {
            return res.status(400).json({ msg: "Token tidak valid atau telah kedaluwarsa" });
        }

        // Reset password
        const hashPassword = await argon2.hash(newPassword);
        await user.update({
            password: hashPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        res.status(200).json({ msg: "Password berhasil diperbarui" });
    } catch (error) {
        console.error("Error saat mereset password:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};


export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        req.session.userId = user.uuid;

        // Update status to 1 (online)
        await User.update({ status: 1 }, { where: { uuid: user.uuid } });

        const { uuid, status, email, name, img_url, phone, role, archived } = user;
        res.status(200).json({ uuid, status, email, name, img_url, phone, role, archived });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const Me = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
        }

        const user = await User.findOne({
            attributes: ['uuid', 'status', 'email', 'name', 'img_url', 'phone', 'role', 'archived'],
            where: { uuid: req.session.userId }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const logOut = async (req, res) => {
    try {
        const userId = req.session.userId;
        req.session.destroy(async (err) => {
            if (err) {
                return res.status(400).json({ msg: "Tidak dapat logout" });
            } else {
                // Update status to 0 (offline)
                await User.update({ status: 0 }, { where: { uuid: userId } });
                res.status(200).json({ msg: "Anda telah logout" });
            }
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};
