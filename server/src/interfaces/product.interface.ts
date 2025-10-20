import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  product_name: string;
  product_description: string;
  product_brand: string;
  product_slug: string;
  product_price: number;
  product_imgs: string[];
  product_category: "laptop" | "phone" | "tablet" | "computer";
  product_attributes: Record<string, any> | any;
  product_stock: number;
  product_sold_amount?: number;
  product_status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IAddProduct {
  product_name: string;
  product_brand: string;
  product_description: string;
  product_price: number;
  product_category: "laptop" | "phone" | "tablet" | "computer";
  product_attributes: Record<string, any> | any;
  product_stock: number;
}

export interface IProductQueryOptions {
  q?: string | undefined;
  brand?: string | string[] | undefined;
  category?: string | string[] | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  minRating?: number | undefined;
  sort?: string | undefined;
  page: number;
  limit: number;
}

