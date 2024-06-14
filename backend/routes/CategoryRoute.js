import express from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/CategoryController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();
//router.get("/products", verifyUser, getProducts);
//router.get("/products/:id", verifyUser, getProductById);
router.get("/category", verifyUser, getCategory);
router.post("/category", verifyUser, createCategory);
//router.post("/category", verifyUser, createProduct);
// router.patch("/products/:id", verifyUser, updateProduct);
// router.delete("/products/:id", verifyUser, deleteProduct);

export default router;
