/* eslint-disable react/prop-types */
import { Menu, X } from "lucide-react";

const SidebarHeader = ({ isCollapsed, toggleCollapse }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      {!isCollapsed && (
        <div className="text-lg font-bold text-taskBlack">Dashboard Sidebar</div>
      )}
      <button onClick={toggleCollapse} className="p-2 rounded-md">
        {isCollapsed ? (
          <Menu size={40} className="rounded-md text-taskBlack hover:bg-orange-500 p-2 -ml-3" />
        ) : (
          <X size={40} className="rounded-md text-taskBlack hover:bg-orange-500 p-2" />
        )}
      </button>
    </div>
  );
};

export default SidebarHeader;
