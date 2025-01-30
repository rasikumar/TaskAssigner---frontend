/* eslint-disable react/prop-types */
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router"; // React Router v6 import

const ProtectedRoute = ({
  children,
  allowedRoles,
  departmentPermissions = {},
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    const userRole = decodedToken.role;
    const userDepartment = decodedToken.department || null; // Handle cases where no department is set

    // Check if the role is allowed
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/not-authorized" replace />;
    }

    // Check department permissions only if departmentPermissions are provided
    if (departmentPermissions[userRole]) {
      if (
        !userDepartment ||
        !departmentPermissions[userRole].includes(userDepartment)
      ) {
        return <Navigate to="/not-authorized" replace />;
      }
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
