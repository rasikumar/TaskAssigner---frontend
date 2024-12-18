/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const SidebarFooter = ({
  isCollapsed,
  name,
  isOpen,
  toggleProfile,
  handleLogout,
}) => (
  <div className={`mt-auto ${isCollapsed ? "p-1 py-3" : "p-4"} relative`}>
    <button
      onClick={toggleProfile}
      className={`flex items-center 2xl:w-full  ${
        isCollapsed ? "2xl:w-12 w-fit" : "w-44"
      }  px-2 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-100`}
    >
      <div
        className={`${
          isCollapsed ? "h-8 w-10 m-auto" : "h-8 w-8"
        } rounded-lg flex items-center justify-center text-sm font-semibold`}
      >
        CN
      </div>
      {!isCollapsed && (
        <div className="ml-2 2xl:text-xs text-[0.62rem] flex flex-col items-start leading-tight transition-all">
          <div className="font-semibold text-taskBlack">
            {name?.mail || "Loading..."}
          </div>
          <div className="text-taskBlack">{name?.role || "Loading..."}</div>
        </div>
      )}
    </button>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute -top-14 right-0 bg-white border border-gray-300 rounded-lg shadow-minimal transition-all"
      >
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline text-sm w-full text-left"
          >
            Logout
          </button>
        </div>
      </motion.div>
    )}
  </div>
);

export default SidebarFooter;
