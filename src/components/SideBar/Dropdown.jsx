/* eslint-disable react/prop-types */
import { useState } from "react";
import { useLocation } from "react-router";
import SidebarLink from "./SidebarLink";

const Dropdown = ({ isCollapsed, label, Icon, links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Check if any link in the dropdown is active
  const isDropdownActive = links.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div>
      <button
        onClick={toggleDropdown}
        className={`flex items-center transition-all duration-300 ${
          isCollapsed ? "justify-center" : "px-4"
        } ${
          isDropdownActive
            ? "bg-blue-500 text-white" // Active styles for dropdown header
            : "text-taskBlack hover:text-taskBlack/50"
        }`}
      >
        <Icon className={`text-xl ${isCollapsed ? "ml-5" : ""}`} />
        {!isCollapsed && (
          <span className="ml-2 2xl:text-base text-xs font-semibold">
            {label}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col gap-4 my-4">
          {links.map((link, index) => (
            <SidebarLink
              key={index}
              to={link.to}
              Icon={link.icon}
              label={link.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
