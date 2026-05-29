export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  categoryId: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
