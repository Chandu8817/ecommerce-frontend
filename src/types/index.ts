export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled" | "return" | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  sizes?: string[];
  size?: string;
  colors?: string[];
  color?: string;
  quantity?: number;
  maxQuantity?: number;
  category: string;
  ageGroup: string;
  gender: string;
  description: string;
  features: string[];
  stock: number;
  rating: number;
  reviews: number;
}

export interface Items {
  productId: Product;
  quantity: number;
}

export interface CartItem {
  items: Items[];
  userId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}


export interface FilterOptions {
  category: string;
  ageGroup: string;
  gender: string;
  priceRange: [number, number];
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  search?: string;
  [key: string]: any; // For dynamic access to filter properties
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  token: string;
  role: string;
}
export interface ShippingAddress {
  name: string,
  street: string,
  city: string,
  state: string,
  zipCode: string,
  phone: string,
  isDefault: boolean,
}

export interface Order {
  _id: string;
  user? : User
  id?: string;
  products?: Product[]; // Array of products with quantities
  totalAmount?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  orderId?: string;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  shippingId?:string; 
  createdAt?: Date;
  updatedAt?: Date;
}
