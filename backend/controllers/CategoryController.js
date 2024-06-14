import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";
import { Op } from "sequelize";

export const getCategory = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Category.findAll({
        attributes: ["uuid", "archived", "name", "description"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Category.findAll({
        attributes: ["uuid", "archived", "name", "description"],
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

export const createCategory = async (req, res) => {
  const { archived, name, description } = req.body;
  try {
    await Category.create({
      archived: archived,
      name: name,
      description: description,
    });
    res.status(201).json({ msg: "Category Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
