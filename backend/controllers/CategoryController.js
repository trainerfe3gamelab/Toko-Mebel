// CategoryController.js

import Category from "../models/CategoryModel.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { code, name, description, created_by } = req.body;
    const category = await Category.create({
      code,
      name,
      description,
      created_by,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Category by UUID
export const getCategoryById = async (req, res) => {
  try {
    const { uuid } = req.params;
    const category = await Category.findOne({ where: { uuid } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Category by UUID
export const updateCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { archived, code, name, description, updated_by } = req.body;
    let category = await Category.findOne({ where: { uuid } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category = await category.update({
      archived: archived || category.archived,
      code: code || category.code,
      name: name || category.name,
      description: description || category.description,
      updated_by: updated_by || category.updated_by,
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Category by UUID
export const deleteCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const category = await Category.findOne({ where: { uuid } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
