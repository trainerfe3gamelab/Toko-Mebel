import User from "../models/UserModel.js";
import argon2 from "argon2";
import multer from "multer";
import upload from "../middleware/multerConfig.js";
import path from "path";


export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'status', 'email', 'name', 'img_url', 'phone', 'role', 'archived']
        });
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'status', 'email', 'name', 'img_url', 'phone', 'role', 'archived'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" });
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "user"
        })
        res.status(201).json({ msg: "Register Berhasil" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const createAdmin = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" });
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        })
        res.status(201).json({ msg: "Register Berhasil" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// Fungsi untuk memperbarui profil pengguna
export const updateUser = async (req, res) => {
    upload.single('img_url')(req, res, async function (err) {
        // Handle error jika ada
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ msg: "Terjadi kesalahan saat mengunggah gambar" });
        } else if (err) {
            return res.status(500).json({ msg: "Terjadi kesalahan saat mengunggah gambar" });
        }

        // Lanjutkan pembaruan profil pengguna setelah gambar berhasil diunggah
        const userId = req.params.id;
        const { name, email, password, confPassword, phone } = req.body;
        const img_url = req.file ? req.file.filename : null; // Hanya mengambil nama file

        try {
            // Mengambil data pengguna yang ingin diupdate
            const user = await User.findOne({ where: { uuid: userId } });
            if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

            // Mengenkripsi password jika ada perubahan
            let hashPassword;
            if (password) {
                if (password !== confPassword) {
                    return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" });
                }
                hashPassword = await argon2.hash(password);
            } else {
                hashPassword = user.password;
            }

            // Memperbarui profil pengguna
            await User.update({
                name: name || user.name,
                email: email || user.email,
                password: hashPassword,
                img_url: img_url || user.img_url,
                phone: phone || user.phone,
            }, {
                where: { uuid: userId }
            });

            res.status(200).json({ msg: "Profil berhasil diperbarui" });
        } catch (error) {
            console.error("Server error:", error);
            res.status(500).json({ msg: "Terjadi kesalahan server" });
        }
    });
};

// Fungsi untuk memperbarui profil pengguna oleh admin
export const updateAdmin = async (req, res) => {
    upload.single('img_url')(req, res, async function (err) {
        // Handle error jika ada
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ msg: "Terjadi kesalahan saat mengunggah gambar" });
        } else if (err) {
            return res.status(500).json({ msg: "Terjadi kesalahan saat mengunggah gambar" });
        }

        // Lanjutkan pembaruan profil pengguna setelah gambar berhasil diunggah
        const userId = req.params.id;
        const { name, email, password, confPassword, phone, role, archived } = req.body;
        const img_url = req.file ? req.file.filename : null; // Hanya mengambil nama file

        try {
            // Mengambil data pengguna yang ingin diupdate
            const user = await User.findOne({ where: { uuid: userId } });
            if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

            // Mengenkripsi password jika ada perubahan
            let hashPassword;
            if (password) {
                if (password !== confPassword) {
                    return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" });
                }
                hashPassword = await argon2.hash(password);
            } else {
                hashPassword = user.password;
            }

            // Memperbarui profil pengguna
            await User.update({
                name: name || user.name,
                email: email || user.email,
                password: hashPassword,
                img_url: img_url || user.img_url,
                phone: phone || user.phone,
                role: role || user.role,
                archived: archived || user.archived,
            }, {
                where: { uuid: userId }
            });

            res.status(200).json({ msg: "Profil pengguna berhasil diperbarui oleh admin" });
        } catch (error) {
            console.error("Server error:", error);
            res.status(500).json({ msg: "Terjadi kesalahan server" });
        }
    });
};

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        })
        res.status(200).json({ msg: "User Deleted" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// export const updateUser = async (req, res) => {
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.id
//         }
//     });
//     if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
//     const { name, email, password, confPassword, role } = req.body;
//     let hashPassword;
//     if (password === "" || password === null) {
//         hashPassword = user.password
//     } else {
//         hashPassword = await argon2.hash(password);
//     }
//     if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok!" });
//     try {
//         await User.update({
//             name: name,
//             email: email,
//             passwor: hashPassword,
//             role: role
//         }, {
//             where: {
//                 id: user.id
//             }
//         })
//         res.status(200).json({ msg: "User Updated" })
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// }