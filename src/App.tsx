import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import {HomePage}  from './pages/HomePage';
import {ShopPage} from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { UserProfile } from './pages/UserProfile';
import AdminRoute from './pages/admin/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
          />
          <Routes>
             <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard/>
              </AdminRoute>
            }
          />
            <Route 
              path="/" 
              element={<HomePage searchQuery={searchQuery} />} 
            />
            <Route 
              path="/profile" 
              element={<UserProfile />} 
            />
            <Route 
              path="/shop" 
              element={<ShopPage searchQuery={searchQuery} />} 
            />
         
            <Route 
              path="/product/:id" 
              element={<ProductPage />} 
            />
            <Route 
              path="/cart" 
              element={<CartPage />} 
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;