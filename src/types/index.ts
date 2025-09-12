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

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
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
  role: string;
}