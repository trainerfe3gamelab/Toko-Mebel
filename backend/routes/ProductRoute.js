import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCategory,
} from "../controllers/ProductsController.js";

import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();
router.get("/products", verifyUser, getProducts);
router.get("/products/:id", verifyUser, getProductById);
router.get("/products/category/:id_category", getProductByCategory);
// router.get("/products/:category", verifyUser, getProductByCategory);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
