import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Edit, PlusCircle } from 'lucide-react';
import { useCart } from '../hooks/api/useCart';
import { Items, ShippingAddress,User } from '../types';
import { useAuth } from '../hooks/api/useAuth';
import { usePayment } from '../hooks/api/usePayment';
import { AddressModal } from '../components/AddressModal';
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CartPage: React.FC = () => {
  const { getCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { getCurrentUser, getShippingAddress,addShippingAddress } = useAuth();
  const [items, setItems] = React.useState<Items[]>([]);
  const [userId, setUserId] = React.useState<string>("");
  const { createPaymentOrder, verifyPayment } = usePayment();
  const [shippingAddress, setShippingAddress] = React.useState<ShippingAddress | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<ShippingAddress | null>(null);

  const handleSaveAddress = async (addressData: Omit<ShippingAddress, '_id'>) => {
    try {
      await addShippingAddress(addressData);
      const addresses = await getShippingAddress();
      const defaultAddress = addresses?.find(addr => addr.isDefault) || null;
      setShippingAddress(defaultAddress);
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleEditAddress = (address: ShippingAddress) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };


  React.useEffect(() => {
   getCurrentUser().then((user:User) => {
    console.log(user._id );
     setUserId(user._id);
   });
  }, []);

  React.useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addresses = await getShippingAddress();
        const defaultAddress = addresses?.find(addr => addr.isDefault) || null;
        setShippingAddress(defaultAddress);
      } catch (error) {
        console.error('Failed to fetch shipping address:', error);
      }
    };
    
    fetchAddress();
  }, []);

  React.useEffect(() => {
    getCart().then((cart) => {
      setItems(cart.items);
      
    });
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    
    updateCartItem(productId, quantity).then(() => {
      getCart().then((cart) => {
        
        setItems(cart.items);
      });
    });
  };

  const removeItem = (productId: string) => {
    removeFromCart(productId).then(() => {
      getCart().then((cart) => {
        setItems(cart.items);
      });
    });
  };

  const clearCartItems = () => {
    clearCart().then(() => {
      setItems([]);
    });
  };


const handleCheckout = async (cart:any,userId:string,shippingAddress:any) => {
  // 1️⃣ Calculate total amount
  const totalAmount = cart.reduce(
    (sum:any, item:any) => sum + item.productId.price * item.quantity,
    0
  );

  // 2️⃣ Prepare products for DB order
  const products = cart.map((item:any) => ({
    product: item.productId._id,
    quantity: item.quantity,
  }));

  // 3️⃣ Create payment order from backend
  const order = await createPaymentOrder(
    totalAmount,
  );


  // 2️⃣ Open Razorpay Checkout
  
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.totalAmount,
    currency: "INR",
    order_id: order?.id,
    name: "My Store",
    description: "Purchase",
    handler: async (response:any) => {
      
      // 5️⃣ Verify payment & create DB order
      await verifyPayment(
        order?.id as string,
        response.razorpay_payment_id,
        response.razorpay_signature,
        {
          user: userId,
          products,
          totalAmount,
          shippingAddress,
          paymentMethod: "razorpay",
        },
      );
      alert("Payment successful!");
    },
    prefill: {
      name: "Test User",
      email: "test@example.com",
      contact: "9876543210",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


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
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <button
              onClick={handleAddNewAddress}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              {shippingAddress ? 'Change Address' : 'Add Address'}
            </button>
          </div>
          <p className="text-gray-600 mt-2">{items.length} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item,index) => (
              
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.productId._id}`} className="flex-shrink-0">
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productId._id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                    >
                      {item.productId.name}
                    </Link>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">{item.productId.category}</span>
                      <span className="text-sm text-gray-600">{item.productId.gender}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₹{item.productId.price * item.quantity}</div>
                    <div className="text-sm text-gray-600">₹{item.productId.price} each</div>
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
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="text-gray-900">₹{items.reduce((total, item) => total + (item.productId.price * item.quantity), 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address</span>
               {shippingAddress ? (
            <div className="relative p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{shippingAddress.name}</p>
                  <p className="text-gray-600">{shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">Phone: {shippingAddress.phone}</p>
                  {shippingAddress.isDefault && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                      Default
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleEditAddress(shippingAddress)}
                  className="text-gray-500 hover:text-indigo-600"
                  aria-label="Edit address"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No shipping address</h3>
                <p className="mt-1 text-sm text-gray-500">Add a shipping address to proceed with your order.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Shipping Address
                  </button>
                </div>
              </div>
            )}
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{items.reduce((total, item) => total + (item.productId.price * item.quantity), 0)}</span>
              </div>
            </div>

            <button 
            disabled={!shippingAddress}
             onClick={() => handleCheckout(items,userId,shippingAddress)} 
             className={`${!shippingAddress ? 'disabled:bg-gray-500 cursor-not-allowed' : 'bg-orange-500 cursor-pointer'} w-full disabled:bg-gray-500 bg-orange-500 text-white font-semibold py-4 rounded-xl hover:bg-orange-600 transition-colors`}
              >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">🔒 Secure checkout with SSL encryption</span>
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleSaveAddress}
        initialData={editingAddress || {}}
        title={editingAddress ? 'Edit Shipping Address' : 'Add New Shipping Address'}
      />
    </div>
  );
};