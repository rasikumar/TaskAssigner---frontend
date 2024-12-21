import { useEffect, useState } from "react";
import SidebarHeader from "./SideBar/SidebarHeader";
import SidebarLink from "./SideBar/SidebarLink";
import Dropdown from "./SideBar/Dropdown";
import SidebarFooter from "./SideBar/SidebarFooter";
import Verify from "./ui/verify";
import { FaDashcube, FaTasks, FaTicketAlt, FaCheck } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";
import { teams } from "@/data/teams";
import { Outlet, useLocation, useNavigate } from "react-router";
import RoleChecker from "@/hooks/RoleChecker";

const UserSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from location or localStorage
  const getRole = location.state?.data?.role || localStorage.getItem("role");
  const getName = location.state?.data?.name || localStorage.getItem("name");

  // Remove surrounding quotes if they exist
  const role = getRole ? getRole.replace(/^"|"$/g, "") : "Loading...";
  const name = getName ? getName.replace(/^"|"$/g, "") : "Loading...";

  // console.log(cleanedRole); // test-teamleader
  // console.log(cleanedName); // test-teamleader

  // Redirect to login if no user data
  useEffect(() => {
    if (!role) {
      navigate("/", { replace: true });
    }
  }, [role, navigate]);

  // Toggle sidebar collapse
  function toggleCollapse() {
    return setIsCollapsed(!isCollapsed);
  }

  // Toggle profile dropdown
  const toggleProfile = () => setIsOpen(!isOpen);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("mail");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="flex w-full p-4 absolute h-full bg-slate-100">
      {/* Sidebar */}
      <div
        className={`fixed rounded-xl flex flex-col h-[calc(100vh-3.5%)] transition-all duration-300 z-50 ${
          isCollapsed ? "w-16" : "w-44 2xl:w-60"
        }`}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />

        {/* Sidebar Links */}
        <div className="flex flex-col gap-4 mt-4">
          <SidebarLink
            to="/dashboard"
            Icon={FaDashcube}
            label="Dashboard"
            isCollapsed={isCollapsed}
          />

          <RoleChecker allowedRoles={["team lead", "hr", "manager"]}>
            <Dropdown
              isCollapsed={isCollapsed}
              label="Team Management"
              Icon={GrUserManager}
              links={teams.map((team) => ({
                to: `./teams/${team.name.toLowerCase().replace(/\s+/g, "-")}`,
                icon: team.icon,
                label: team.name,
              }))}
            />
          </RoleChecker>

          <SidebarLink
            to="/dashboard/projects"
            Icon={FaTasks}
            label="Project Management"
            isCollapsed={isCollapsed}
          />
          <SidebarLink
            to="/dashboard/ticket"
            Icon={FaTicketAlt}
            label="Tickets Management"
            isCollapsed={isCollapsed}
          />
          <RoleChecker allowedRoles={["hr"]}>
            <SidebarLink
              to="/dashboard/usermanagement"
              Icon={FaCheck}
              label="User Management"
              isCollapsed={isCollapsed}
            />
          </RoleChecker>
        </div>

        {/* Sidebar Footer */}
        <SidebarFooter
          isCollapsed={isCollapsed}
          name={name}
          role={role}
          isOpen={isOpen}
          toggleProfile={toggleProfile}
          handleLogout={handleLogout}
        />
      </div>

      {/* Logout Modal */}
      <Verify
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to finish your tasks and log out?"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      {/* Welcome Message */}
      <div
        className={`fixed bg-bg rounded-xl p-4 z-40 transition-all m-auto ${
          isCollapsed
            ? "mt-4 right-4 2xl:w-[113rem] w-[73rem] top-0"
            : "2xl:w-[102rem] w-[66rem] mt-4 right-4 top-0"
        }`}
      >
        Welcome Back {name || "loading"}
      </div>

      {/* Main Content */}
      <div
        className={`grid rounded-xl p-8 shadow-bottom mt-8 bg-bg transition-all overflow-x-hidden w-full relative ${
          isCollapsed ? "ml-20" : "2xl:ml-64 ml-48"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default UserSidebar;
