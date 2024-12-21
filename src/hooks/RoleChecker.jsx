/* eslint-disable react/prop-types */
import { useLocation } from "react-router"; // If you're using react-router for navigation
import { useState, useEffect } from "react";

const RoleChecker = ({ allowedRoles, children }) => {
  const location = useLocation(); // This gives you access to the current location's state
  const [role, setRole] = useState("Loading...");

  useEffect(() => {
    // Fetch the role either from the location state or localStorage
    const getRole = location.state?.data?.role || localStorage.getItem("role");
    const cleanedRole = getRole ? getRole.replace(/^"|"$/g, "") : "Loading...";
    setRole(cleanedRole);
  }, [location.state]);

  if (!allowedRoles) {
    throw new Error("allowedRoles prop is required");
  }

  if (role === "Loading...") {
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(role)) {
    return <></>;
  }

  // If the role is allowed, render the children
  return <>{children}</>;
};

export default RoleChecker;
