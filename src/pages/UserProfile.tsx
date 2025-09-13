import React, { useEffect, useState } from 'react';
import { FiUser, FiShoppingBag, FiMapPin, FiSettings, FiEdit2, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { useAuth, useOrders } from '../hooks/api';
import { User as UserType, ShippingAddress, Order } from '../types';

// Mock data - replace with actual API calls

type TabType = 'profile' | 'orders' | 'addresses' | 'settings';

export const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const { getCurrentUser, isAuthenticated, getShippingAddress, addShippingAddress } = useAuth();
  const { getOrdersByUser } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
 
  const [profile, setProfile] = useState<UserType | null>(null);
  
  // Form state

  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    
    if(isAuthenticated()){
      getCurrentUser().then((user) => {
        getOrdersByUser(user?._id as string).then((orders) => {
          console.log(orders);
          setOrders(orders as unknown as Order[]);
        });
      
        setProfile(user as unknown as UserType);
      });
      getShippingAddress().then((addresses) => {
        setAddresses(addresses as unknown as ShippingAddress[]);
      });
    
    }
  },[]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //@ts-ignore
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address = {
      id: Date.now(),
      name: newAddress.name,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zipCode: newAddress.zipCode,
      phone: newAddress.phone,
      isDefault: newAddress.isDefault,
    };
    addShippingAddress(address);
    if (newAddress.isDefault) {
      setAddresses(prev => 
        prev.map(addr => ({ ...addr, isDefault: false }))
          .concat(address)
      );
    } else {
      setAddresses(prev => [...prev, address]);
    }
    
    // Reset form
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isDefault: false,
    });
  };

  const removeAddress = (id: number) => {
    setAddresses(prev => prev.filter((_,index) => index !== id));
  };

  const setDefaultAddress = (id: number) => {
    setAddresses(prev => 
      prev.map((addr,index) => ({
        ...addr,
        isDefault:  index === id,
      }))
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-orange-600 hover:text-orange-700 flex items-center"
              >
                <FiEdit2 className="mr-1" />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile?.name}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile?.email}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile?.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                />
              </div>
              
              {isEditing && (
                <div className="pt-2">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Order History</h2>
            </div>
            
            <div className="divide-y">
              {orders.map((order:Order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order {order._id}</p>
                      <p className="text-sm text-gray-500">Placed on {order.createdAt?.toString() || ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.totalAmount || 0}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order?.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <button className="mt-2 text-sm text-orange-600 hover:text-orange-700 flex items-center">
                    View Details <FiChevronRight className="ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {addresses.map((address,index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 relative ${address.isDefault ? 'border-orange-500' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{address.name}</h3>
                      {address.isDefault && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{`${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`}</p>
                    <div className="flex space-x-3 text-sm">
                      <button 
                        onClick={() => setDefaultAddress(index)}
                        disabled={address.isDefault}
                        className={`text-orange-600 hover:text-orange-700 ${address.isDefault ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Set as default
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <FiEdit2 className="inline mr-1" /> Edit
                      </button>
                      <button 
                        onClick={() => removeAddress(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="inline mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Add New Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Name (e.g., Home, Work)</label>
                      <input
                        type="text"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={newAddress.zipCode}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="defaultAddress"
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleAddressChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates about your orders and promotions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Get order updates via text message</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-500">Receive our newsletter and special offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:space-x-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0 mb-8 md:mb-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xl">
                    {profile?.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold">{profile?.name}</h2>
                    <p className="text-sm text-gray-500">{profile?.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left ${
                    activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiUser className="h-5 w-5" />
                  <span>My Profile</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left ${
                    activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiShoppingBag className="h-5 w-5" />
                  <span>My Orders</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left ${
                    activeTab === 'addresses' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiMapPin className="h-5 w-5" />
                  <span>Saved Addresses</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left ${
                    activeTab === 'settings' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiSettings className="h-5 w-5" />
                  <span>Account Settings</span>
                </button>
              </nav>
              
              <div className="p-4 border-t">
                <button className="w-full text-red-600 hover:text-red-700 text-left font-medium">
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;