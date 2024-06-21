import express from "express";
import productMulterConfig from "../middleware/productMulterConfig.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/ProductController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:uuid", getProductById);
router.post(
  "/products",
  verifyUser,
  adminOnly,
  productMulterConfig.single("img_url"),
  createProduct
);
router.put(
  "/products/:uuid",
  productMulterConfig.single("img_url"),
  updateProduct
);
router.delete("/products/:uuid", deleteProduct);
router.get("/search", searchProducts);

export default router;
