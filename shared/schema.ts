import { z } from "zod";

// Product schema
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  fabric: string;
  occasion: string;
  color: string;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const insertProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  images: z.array(z.string()),
  category: z.string(),
  fabric: z.string(),
  occasion: z.string(),
  color: z.string(),
  inStock: z.boolean().default(true),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;

// User schema with address
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  addresses: Address[];
}

export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  phone: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(10),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(6).max(6),
  isDefault: z.boolean().optional(),
});

export type InsertAddress = z.infer<typeof addressSchema>;

// Cart schema
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export const insertCartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

// Order schema
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}

export const insertOrderSchema = z.object({
  addressId: z.string(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
