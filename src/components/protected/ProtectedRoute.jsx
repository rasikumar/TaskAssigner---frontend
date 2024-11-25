import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router"; // React Router v6 import

/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/" replace />;
  }

  try {
    // Decode the token
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token has expired
    if (decodedToken.exp < currentTime) {
      // Optional: Remove expired token from localStorage
      localStorage.removeItem("token");

      // Redirect to login if token is expired
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/" replace />; // Redirect in case of decoding error
  }

  // If the token is valid, render the children (protected route content)
  return children;
};

export default ProtectedRoute;
