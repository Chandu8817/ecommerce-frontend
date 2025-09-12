import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { apiGet } from '../hooks/api/apiConfig';
import { Product as CartProduct } from '../types';

interface Product extends Omit<CartProduct, 'id' | 'image' | 'features'> {
  _id: string;
  images: string[];
  specifications: Record<string, string>;
  details: string[];
  stock: number;
  tags: string[];
  colors: string[];
  sizes: string[];
  reviews: number;
}

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchProduct = async () => {

      if (!id) {
        
        setError('Product ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const response = await apiGet<{ data: Product }>(`/products/${id}`);
        const productData = response;
        setProduct(productData);
        
        // Set default selections
        if (productData.sizes?.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        if (productData.colors?.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <p className="text-red-500 text-lg mb-4">{error || 'Product not found'}</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem: CartProduct = {
      _id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
      maxQuantity: product.stock,
      category: product.category,
      ageGroup: product.ageGroup,
      gender: product.gender,
      features: product.details || []
    };
    
    addItem(cartItem);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                    {product.category}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              {/* <div>
                <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div> */}

              {/* Size Selection */}
              {/* <div>
                <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex space-x-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock===0}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock>0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              </div>

              {/* Features Cards */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Free Shipping</div>
                  <div className="text-xs text-gray-600">On orders over ₹999</div>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Easy Returns</div>
                  <div className="text-xs text-gray-600">30-day return policy</div>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Quality Assured</div>
                  <div className="text-xs text-gray-600">Premium materials</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};