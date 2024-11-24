import { Navigate } from "react-router";

/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if token is not found
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
