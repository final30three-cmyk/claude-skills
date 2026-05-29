import type { RequestHandler } from "express";
import { clampPagination } from "@backend-api/shared";
import * as productService from "../services/product.service";
import type { CreateProductDto, UpdateProductDto } from "../dto/product.dto";

export const listProducts: RequestHandler = (req, res, next) => {
  try {
    const params = clampPagination(req.query as Record<string, string>);
    const { page: _p, limit: _l, ...filters } = req.query as Record<string, string>;
    const result = productService.list(params, filters);
    res.json({ data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
};

export const getProduct: RequestHandler = (req, res, next) => {
  try {
    const item = productService.getById(req.params.id as string);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

export const createProduct: RequestHandler = (req, res, next) => {
  try {
    const item = productService.create(req.body as CreateProductDto);
    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
};

export const updateProduct: RequestHandler = (req, res, next) => {
  try {
    const item = productService.update(req.params.id as string, req.body as UpdateProductDto);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct: RequestHandler = (req, res, next) => {
  try {
    productService.remove(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
