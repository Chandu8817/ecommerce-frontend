// src/components/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { User as UserType } from "../../types";
import { ReactNode, useEffect, useState } from "react";
import useAuth from "../../hooks/api/useAuth";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { getCurrentUser, isAuthenticated } = useAuth();

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

  // 🔹 Jab tak API load ho rahi hai
  if (loading) {
    return <div>Loading...</div>;
  }

  // 🔹 Agar login nahi hai ya user null hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Agar admin nahi hai
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 🔹 Agar sab ok hai
  return <>{children}</>;
};

export default AdminRoute;
