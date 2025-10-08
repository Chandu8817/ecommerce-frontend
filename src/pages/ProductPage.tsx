import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, Heart, Star, ShoppingCart, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '../hooks/api/useCart';
import { apiGet } from '../hooks/api/apiConfig';
import type { Product } from '../types';
import type { CartItem } from '../types';
import API_BASE_URL from '../config';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, loading: isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { getCart } = useCart();
  const [cart, setCart] = useState<CartItem>({ items: [], userId: '', _id: '', createdAt: '', updatedAt: '' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = product?.images || [];
  const staticBase = API_BASE_URL.replace("/api", "");
  
  // Handle adding product to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      // Create a new product object with all required fields
      const cartProduct: Product = {
        ...product,
        image: product.images?.[0] || '',
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        sizes: product.sizes || [],
        colors: product.colors || [],
        features: product.features || [],
        ageGroup: product.ageGroup || '', 
        gender: product.gender || 'unisex',
        description: product.description || ''
      };
      
      await addToCart(cartProduct, quantity);
   
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setNotification({
        message: 'Failed to add item to cart. Please try again.',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    getCart().then(setCart);
  }, []);



  useEffect(() => {
    const fetchProduct = async () => {

      if (!id) {
        
        setError('Product ID is missing');
        setLoading(false);
        return;
      }
console.log(cart.items.length);
      try {
        setLoading(true);
        
        const response = await apiGet<{ data: Product }>(`/products/${id}`);
        const productData = response;
        setProduct(productData as unknown as Product );
        
        // Initialize product data
        // Note: Removed unused state setters
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
  // Calculate discount percentage
  const discountPercentage = product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
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
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg ${
            isAddingToCart ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
          } transition-colors flex items-center justify-center gap-2`}
        >
          {isAddingToCart ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-7-7h6m0 0l3 3m-3-3l-3 3" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    );
  }






  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
          <div className="flex flex-col items-center space-y-3 w-full max-w-md mx-auto">
      {/* Image display */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
        {images.map((img, index) => (
          <img
            key={index}
            src={`${staticBase}${img}`}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              index === selectedIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center space-x-2 mt-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
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
                      onClick={() => {
                        if (quantity < product.stock) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Quantity: {product.stock}</p>
                </div>

                {cart.items.length>0?
                <Link to='/cart'>
                  <button
                   className="w-full flex items-center justify-center space-x-2 py-4 bg-orange-500 text-white font-semibold 
                   rounded-xl hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                   <ShoppingCart className="w-5 h-5" />
                   <span>Go to Cart</span>
                   </button>
                  </Link>:
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock===0 || quantity===0}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock>0?'Add to Cart':'Out of Stock'}</span>
                </button>}
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