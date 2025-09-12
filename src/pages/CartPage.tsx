import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{itemCount} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">{item.category}</span>
                      <span className="text-sm text-gray-600">{item.gender}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₹{item.price * item.quantity}</div>
                    <div className="text-sm text-gray-600">₹{item.price} each</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                to="/shop"
                className="text-orange-500 hover:text-orange-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border h-fit sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                <span className="text-gray-900">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">₹{Math.round(total * 0.18)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total + Math.round(total * 0.18)}</span>
              </div>
            </div>

            <button className="w-full bg-orange-500 text-white font-semibold py-4 rounded-xl hover:bg-orange-600 transition-colors">
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">🔒 Secure checkout with SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};