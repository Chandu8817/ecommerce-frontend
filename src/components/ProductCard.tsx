import React, { useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../hooks/api/useCart';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    setAdding(true);
    try {
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
        description: product.description || '',
      };
      await addToCart(cartProduct, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isList = viewMode === 'list';

  return (
    <Link to={`/product/${product._id}`} className={`group block ${isList ? 'sm:flex' : ''}`}>
      <article
        className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-xl ${
          isList ? 'flex w-full flex-col sm:flex-row' : 'h-full'
        }`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden bg-neutral-100 ${isList ? 'sm:w-56 sm:shrink-0' : 'aspect-[4/5]'}`}>
          <img
            src={product.images?.[0] || ''}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isList ? 'aspect-[4/5] sm:aspect-auto' : ''
            } group-hover:scale-105`}
          />

          {discountPercentage > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}

          <button
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:text-accent-600 group-hover:opacity-100"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          {product.stock === 0 && (
            <div className="absolute inset-0 grid place-items-center bg-ink/50">
              <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className={`flex flex-col p-4 ${isList ? 'flex-1' : ''}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-neutral-600">
              {product.category}
            </span>
            {product.rating ? (
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                {product.rating}
                {product.reviews ? <span className="text-neutral-400">({product.reviews})</span> : null}
              </span>
            ) : null}
          </div>

          <h3 className="line-clamp-2 font-semibold text-neutral-900 transition-colors group-hover:text-accent-600">
            {product.name}
          </h3>

          {isList && product.description && (
            <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{product.description}</p>
          )}

          <div className={`flex items-center justify-between gap-2 ${isList ? 'mt-4' : 'mt-3'}`}>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-neutral-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white transition-all hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-neutral-300"
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};
