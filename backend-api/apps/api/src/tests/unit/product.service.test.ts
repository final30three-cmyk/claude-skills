import * as productService from "../../services/product.service";
import type { CreateProductDto } from "../../dto/product.dto";
import crypto from "crypto";

describe("product.service", () => {
  const sampleProduct: CreateProductDto = {
    name: "Test Product",
    price: 29.99,
    description: "A test product",
    categoryId: crypto.randomUUID(),
    stock: 10,
  };

  it("should create a product", () => {
    const product = productService.create(sampleProduct);
    expect(product.id).toBeDefined();
    expect(product.name).toBe(sampleProduct.name);
    expect(product.price).toBe(sampleProduct.price);
  });

  it("should list products with pagination", () => {
    const result = productService.list({ page: 1, limit: 10 });
    expect(result.items).toBeDefined();
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
  });

  it("should get product by id", () => {
    const created = productService.create(sampleProduct);
    const found = productService.getById(created.id);
    expect(found.id).toBe(created.id);
  });

  it("should throw on non-existent product", () => {
    expect(() => productService.getById("non-existent")).toThrow();
  });
});
