import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import path from "path";
import multer from "multer";
import fs from "fs";
import upload from "../middleware/upload.js";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: [
          "id",
          "uuid",
          "name",
          "img_url",
          "description",
          "id_category",
          "unit",
          "price",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findAll({
        attributes: [
          "id",
          "uuid",
          "name",
          "img_url",
          "description",
          "id_category",
          "unit",
          "price",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;

    response = await Product.findOne({
      where: {
        id: product.id,
      },
      attributes: [
        "id",
        "uuid",
        "name",
        "img_url",
        "description",
        "id_category",
        "unit",
        "price",
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id_category: req.params.id_category,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;

    response = await Product.findOne({
      where: {
        id_category: req.params.id_category,
      },
      attributes: [
        "id",
        "uuid",
        "name",
        "img_url",
        "description",
        "id_category",
        "unit",
        "price",
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  upload.single("img_url")(req, res, async function (err) {
    // Tangani kesalahan spesifik dari multer
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        msg: "Terjadi kesalahan saat mengunggah gambar",
        error: err.message,
      });
    } else if (err) {
      // Tangani kesalahan lainnya
      return res.status(500).json({
        msg: "Terjadi kesalahan saat mengunggah gambar",
        error: err.message,
      });
    }

    // Destrukturisasi field dari req.body
    const { archived, name, description, id_category, unit, sku, price } =
      req.body;
    // Set img_url ke null jika tidak ada file yang diunggah
    const img_url = req.file ? req.file.filename : null;

    try {
      // Buat produk baru di database
      await Product.create({
        archived: archived,
        name: name,
        description: description,
        id_category: id_category,
        unit: unit,
        sku: sku,
        price: price,
        img_url: img_url,
      });

      // Jika berhasil, kirim respons status 201
      res.status(201).json({ msg: "Data berhasil ditambahkan" });
    } catch (error) {
      // Tangani kesalahan saat operasi database
      res.status(500).json({ error: error.message });
    }
  });
};

// export const createProduct = async (req, res) => {
//   upload.single("img_url")(req, res, async function (err) {
//     // Handle error jika ada
//     if (err instanceof multer.MulterError) {
//       return res
//         .status(500)
//         .json({ msg: "Terjadi kesalahan saat mengunggah gambar" });
//     } else if (err) {
//       return res
//         .status(501)
//         .json({
//           msg: "Terjadi kesalahan saat mengunggah gambar",
//           error: err.message,
//         });
//     }
//     const { archived, name, description, id_category, unit, sku, price } =
//       req.body;
//     const img_url = req.file ? req.file.filename : null;
//     try {
//       await Product.create({
//         archived: archived,
//         name: name,
//         description: description,
//         id_category: id_category,
//         unit: unit,
//         sku: sku,
//         price: price,
//         img_url: img_url,
//       });

//       res.status(201).json({ msg: "Data berhasil ditambahkan" });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
// };

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Product.update(
        { name, price },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Product.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Product updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Product.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Product.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Product deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
