import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router"; // React Router v6 import
/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children, allowedRoles }) => {
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
      // Remove expired token
      localStorage.removeItem("token");

      // Redirect to login
      return <Navigate to="/" replace />;
    }

    // Check if the user's role is included in the allowed roles
    if (!allowedRoles.includes(decodedToken.role)) {
      // Redirect to a "Not Authorized" page or home
      return <Navigate to="/not-authorized" replace />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/" replace />; // Redirect in case of decoding error
  }

  // If the token is valid and the role matches, render the children (protected content)
  return children;
};

export default ProtectedRoute;
