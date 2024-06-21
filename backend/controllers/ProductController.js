// ProductController.js

import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import { Op } from "sequelize";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { id_user, name, description, id_category, unit, sku, price } =
      req.body;
    const img_url = req.file ? req.file.filename : null;
    const product = await Product.create({
      id_user,
      name,
      description,
      id_category,
      unit,
      sku,
      price,
      img_url,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ["name"] }],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Product by UUID
export const getProductById = async (req, res) => {
  try {
    const { uuid } = req.params;
    const product = await Product.findOne({
      where: { uuid },
      include: [{ model: Category, attributes: ["name"] }],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product by UUID
export const updateProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { id_user, name, description, id_category, unit, sku, price } =
      req.body;
    const img_url = req.file ? req.file.filename : null;

    let product = await Product.findOne({ where: { uuid } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product = await product.update({
      id_user: id_user || product.id_user,
      name: name || product.name,
      description: description || product.description,
      id_category: id_category || product.id_category,
      unit: unit || product.unit,
      sku: sku || product.sku,
      price: price || product.price,
      img_url: img_url || product.img_url,
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Product by UUID
export const deleteProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const product = await Product.findOne({ where: { uuid } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from request parameters

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Perform search using Sequelize
    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
