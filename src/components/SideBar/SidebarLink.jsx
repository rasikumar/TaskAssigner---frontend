/* eslint-disable react/prop-types */

import { Link, useLocation } from "react-router";

const SidebarLink = ({ to, Icon, label, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center transition-all duration-300 ${
        isCollapsed ? "justify-center" : "px-4"
      } ${
        isActive
          ? "bg-bg rounded-xl p-4 text-black" // Active styles
          : "text-taskBlack hover:text-taskBlack/50"
      }`}
    >
      <Icon className="text-xl" />
      {!isCollapsed && (
        <span className="ml-2 2xl:text-base text-xs font-semibold">
          {label}
        </span>
      )}
    </Link>
  );
};

export default SidebarLink;
