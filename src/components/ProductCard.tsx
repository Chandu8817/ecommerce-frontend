import React from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link 
      to={`/product/${product._id}`} 
      className={`block group ${viewMode === 'list' ? 'flex' : ''}`}
    >
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg ${viewMode === 'list' ? 'flex-1 flex' : 'hover:-translate-y-1'}`}>
        {/* Image Container */}
        <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'aspect-square'}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 ${viewMode === 'grid' ? 'group-hover:scale-105' : ''}`}
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              {discountPercentage}% OFF
            </div>
          )}
          
          {/* Heart Icon */}
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-orange-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-600 hover:scale-105"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          {/* Stock Status */}
          {product.stock===0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
          <div className={viewMode === 'list' ? 'flex-1' : ''}>
            {/* Category & Age Group */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-orange-600 font-medium px-2 py-1 bg-orange-50 rounded-full">
                {product.category}
              </span>
              <span className="text-xs text-gray-500">
                {product.ageGroup}
              </span>
            </div>

            {/* Product Name */}
            <h3 className={`font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors ${viewMode === 'list' ? 'text-lg' : ''}`}>
              {product.name}
            </h3>

            {/* Description - Only show in list view */}
            {viewMode === 'list' && product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mt-4 pt-4 border-t border-gray-100' : ''}`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 capitalize">{product.gender}</span>
              {viewMode === 'list' && (
                <button
                  onClick={handleAddToCart}
                  className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};