import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import useAuth from '../hooks/api/useAuth';
import { User as UserType } from '../types';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {getCurrentUser,logout,isAuthenticated} = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { itemCount } = useCart();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if(isAuthenticated()){
      getCurrentUser().then((user) => {
        setUser(user);
      });
    }
  }, [isAuthModalOpen]);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🕺</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                KidsWear
              </h1>
              <p className="text-xs text-gray-500">Indian Fashion</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for kids clothing..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center space-x-4">


            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                  >
                    <User className="w-6 h-6 mr-1" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                      <ul className="py-1">
                        <li>
                          <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {user?.name}
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              // Add your logout logic here
                              logout();
                              console.log('Logout');
                              setUser(null);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <span>Login</span>
      
                </button>
              )}
              <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
              />
              
            </div>


          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for kids clothing..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>


      </div>
    </header>
  );
};

