// src/components/PrivateRoute.tsx
import { Navigate, useNavigate } from "react-router-dom";
import { User as UserType } from "../../types";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/api/useAuth";
import {  FaCartArrowDown, FaRegUser, FaProductHunt } from "react-icons/fa";
import {ProductsManagement} from "./ProductsManagement";



const PrivateRoute = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { getCurrentUser, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState("products");

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated()) {
        try {
          const res = await getCurrentUser();
          setUser(res as UserType);
        } catch (err) {
          console.error("Failed to fetch user", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Jab tak API chal rahi hai
  if (loading) {
    return <div>Loading...</div>;
  }

  // Agar login hi nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar login hai to children dikhado
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="flex flex-row justify-between items-center h-screen">

        {/* side bar */}
        <div className="flex flex-col space-y-4 h-full w-1/4 bg-gray-100 p-4">
          <button className="flex items-center justify-center space-x-2 bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setSelectedTab("products")}>
            <FaProductHunt className="text-2xl" />
            <span>Products</span>
          </button>

          <button className="flex items-center justify-center space-x-2 bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setSelectedTab("orders")}>
            <FaCartArrowDown className="text-2xl" />
            <span>Orders</span>
          </button>

          <button className="flex items-center justify-center space-x-2 bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setSelectedTab("users")}>
            <FaRegUser className="text-2xl" />
            <span>Users</span>
          </button>
        </div>

        {/* main content */}
        {selectedTab === "products" && <ProductsManagement />}
       
      </div>
    </div>
  );
};

export default PrivateRoute;
