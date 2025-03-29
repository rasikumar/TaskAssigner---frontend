/* eslint-disable react/prop-types */
// Dropdown.jsx
import { useState } from "react";
import { NavLink } from "react-router";

const Dropdown = ({ isCollapsed, label, Icon, links, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative font-semibold">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full p-2 rounded-lg transition-colors hover:bg-gray-100 ${
          isCollapsed ? "justify-center" : "justify-start gap-3"
        }`}
      >
        <Icon className="text-lg" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>

      {!isCollapsed && isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => onSelect(link)}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-colors ${
                  isActive ? "bg-bg" : "hover:bg-gray-100"
                }`
              }
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
