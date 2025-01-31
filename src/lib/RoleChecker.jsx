/* eslint-disable react/prop-types */
import { useLocation } from "react-router";
import { useState, useEffect } from "react";

const RoleChecker = ({ allowedRoles, allowedDepartments, children }) => {
  const location = useLocation();
  const [user, setUser] = useState({ role: "Loading...", department: null });

  useEffect(() => {
    // Fetch user details from location state or localStorage
    const storedRole =
      location.state?.data?.role || localStorage.getItem("role");
    const storedDepartment =
      location.state?.data?.department || localStorage.getItem("department");

    const role = storedRole ? storedRole.replace(/^"|"$/g, "") : "Loading...";
    const department = storedDepartment
      ? storedDepartment.replace(/^"|"$/g, "")
      : null;

    setUser({ role, department });
  }, [location.state]);

  if (!allowedRoles) {
    throw new Error("allowedRoles prop is required");
  }

  if (user.role === "Loading...") {
    return <div>Loading...</div>;
  }

  const isRoleAllowed = allowedRoles.includes(user.role);
  const isDepartmentAllowed = allowedDepartments
    ? allowedDepartments.includes(user.department)
    : true;

  if (!isRoleAllowed || !isDepartmentAllowed) {
    return <></>; // Hide the component if conditions don't match
  }

  return <>{children}</>;
};

export default RoleChecker;
