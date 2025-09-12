import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Traditional Lehenga Choli Set',
    price: 2499,
    originalPrice: 3999,
    image: 'https://images.pexels.com/photos/8088473/pexels-photo-8088473.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/8088473/pexels-photo-8088473.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8088472/pexels-photo-8088472.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Traditional',
    ageGroup: '6-12 years',
    gender: 'Girls',
    description: 'Beautiful traditional lehenga choli set with intricate embroidery and vibrant colors. Perfect for festivals and special occasions.',
    features: ['Handcrafted embroidery', 'Premium cotton fabric', 'Comfortable fit', 'Easy to wash'],
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: '2',
    name: 'Kurta Pajama Set',
    price: 1799,
    originalPrice: 2499,
    image: 'https://images.pexels.com/photos/8134988/pexels-photo-8134988.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/8134988/pexels-photo-8134988.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Traditional',
    ageGroup: '3-8 years',
    gender: 'Boys',
    description: 'Classic kurta pajama set in soft cotton fabric. Ideal for festivals, weddings, and cultural events.',
    features: ['Pure cotton', 'Button-down kurta', 'Elastic waist pajama', 'Machine washable'],
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    name: 'Floral Anarkali Dress',
    price: 1999,
    originalPrice: 2999,
    image: 'https://images.pexels.com/photos/8088471/pexels-photo-8088471.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/8088471/pexels-photo-8088471.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Traditional',
    ageGroup: '4-10 years',
    gender: 'Girls',
    description: 'Elegant Anarkali dress with beautiful floral patterns. Made with soft, breathable fabric for comfort.',
    features: ['Floral print', 'Flared design', 'Soft lining', 'Side zip closure'],
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '4',
    name: 'Casual Cotton T-Shirt',
    price: 599,
    originalPrice: 899,
    image: 'https://images.pexels.com/photos/8134992/pexels-photo-8134992.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/8134992/pexels-photo-8134992.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Casual',
    ageGroup: '2-8 years',
    gender: 'Unisex',
    description: 'Comfortable cotton t-shirt with fun prints. Perfect for daily wear and playtime.',
    features: ['100% cotton', 'Fun graphics', 'Pre-shrunk', 'Durable print'],
    inStock: true,
    rating: 4.4,
    reviews: 312
  },
  {
    id: '5',
    name: 'Denim Jacket',
    price: 1299,
    originalPrice: 1799,
    image: 'https://images.pexels.com/photos/8088470/pexels-photo-8088470.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/8088470/pexels-photo-8088470.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Casual',
    ageGroup: '5-12 years',
    gender: 'Unisex',
    description: 'Stylish denim jacket that goes with everything. Durable construction for active kids.',
    features: ['Premium denim', 'Multiple pockets', 'Button closure', 'Classic fit'],
    inStock: true,
    rating: 4.5,
    reviews: 147
  },
  {
    id: '6',
    name: 'Ethnic Dhoti Set',
    price: 1599,
    image: 'https://images.pexels.com/photos/8134989/pexels-photo-8134989.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/8134989/pexels-photo-8134989.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Traditional',
    ageGroup: '4-10 years',
    gender: 'Boys',
    description: 'Traditional dhoti set with kurta. Perfect for cultural celebrations and festivals.',
    features: ['Traditional style', 'Comfortable fabric', 'Easy to wear', 'Festival ready'],
    inStock: true,
    rating: 4.3,
    reviews: 76
  },
  {
    id: '7',
    name: 'Designer Sharara Set',
    price: 2799,
    originalPrice: 3999,
    image: 'https://images.pexels.com/photos/8088469/pexels-photo-8088469.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/8088469/pexels-photo-8088469.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Traditional',
    ageGroup: '8-14 years',
    gender: 'Girls',
    description: 'Stunning sharara set with intricate work. Ideal for weddings and special occasions.',
    features: ['Heavy work', 'Premium fabric', 'Designer cut', 'Special occasion wear'],
    inStock: true,
    rating: 4.9,
    reviews: 234
  },
  {
    id: '8',
    name: 'Cotton Casual Shorts',
    price: 699,
    originalPrice: 999,
    image: 'https://images.pexels.com/photos/8134991/pexels-photo-8134991.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/8134991/pexels-photo-8134991.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Casual',
    ageGroup: '3-10 years',
    gender: 'Unisex',
    description: 'Comfortable cotton shorts for everyday play. Available in multiple colors.',
    features: ['Soft cotton', 'Elastic waist', 'Multiple colors', 'Easy care'],
    inStock: true,
    rating: 4.2,
    reviews: 189
  }
];