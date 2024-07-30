import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../services/api";

const ProtectedRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.post("/auth/user");
        if (res) {
          setIsAuthorized(true);
        }
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    checkUser();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading. . .</div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
