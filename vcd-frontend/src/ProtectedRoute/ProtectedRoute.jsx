import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isLoggedIn = !!localStorage.getItem("token"); // Check if the token exists
  return isLoggedIn ? element : <Navigate to="/" />; // Redirect to login if not logged in
};

export default ProtectedRoute;
