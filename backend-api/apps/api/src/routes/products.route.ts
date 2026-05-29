import { Router, type IRouter } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { productSchema, productUpdateSchema } from "../dto/product.dto";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";

export const productsRouter: IRouter = Router();

productsRouter.get("/", authenticate, listProducts);
productsRouter.get("/:id", authenticate, getProduct);
productsRouter.post("/", authenticate, validate(productSchema), createProduct);
productsRouter.put("/:id", authenticate, validate(productUpdateSchema), updateProduct);
productsRouter.delete("/:id", authenticate, deleteProduct);
