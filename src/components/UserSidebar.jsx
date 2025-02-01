import { useState } from "react";
import SidebarHeader from "./SideBar/SidebarHeader";
import SidebarLink from "./SideBar/SidebarLink";
import Dropdown from "./SideBar/Dropdown";
import Verify from "./ui/verify";
import {
  FaDashcube,
  FaTasks,
  FaTicketAlt,
  FaCheck,
  FaProjectDiagram,
} from "react-icons/fa";
import { GrDocumentPdf, GrUserManager } from "react-icons/gr";
import { teams } from "@/data/teams";
import { Outlet, useNavigate } from "react-router";
import UserSidebarFooter from "./SideBar/UserSidebarFooter";
import RoleChecker from "@/lib/RoleChecker";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleProfile = () => setIsOpen(!isOpen);

  const getName = location.state?.data?.name || localStorage.getItem("name");
  const name = getName ? getName.replace(/^"|"$/g, "") : "Loading...";

  const getRole = location.state?.data?.role || localStorage.getItem("role");
  const role = getRole ? getRole.replace(/^"|"$/g, "") : "Loading...";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("mail");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  // console.log(name);

  return (
    <div className={cn("flex h-screen w-full p-4 absolute bg-slate-100")}>
      <div
        className={`fixed rounded-xl flex flex-col h-[calc(100vh-3.5%)] overflow-y-scroll transition-all duration-300 z-50 ${
          isCollapsed ? "w-16" : "w-44 2xl:w-60"
        }`}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
        <div className="flex flex-col gap-4 mt-4">
          <SidebarLink
            to="/dashboard"
            Icon={FaDashcube}
            label="Dashboard"
            isCollapsed={isCollapsed}
          />
          <RoleChecker
            allowedRoles={["manager"]}
            // allowedDepartments={["human-resource"]}
          >
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
          <RoleChecker allowedRoles={["manager"]}>
            <SidebarLink
              to="/dashboard/projects"
              Icon={FaTasks}
              label="Project Management"
              isCollapsed={isCollapsed}
            />
          </RoleChecker>
          <SidebarLink
            to="/dashboard/tasks"
            Icon={FaProjectDiagram}
            label="Tasks Management"
            isCollapsed={isCollapsed}
          />
          <RoleChecker
            allowedRoles={["manager", "team lead", "member"]}
            allowedDepartments={["development", "testing"]}
          >
            <SidebarLink
              to="/dashboard/ticket"
              Icon={FaTicketAlt}
              label="Tickets Management"
              isCollapsed={isCollapsed}
            />
          </RoleChecker>
          <SidebarLink
            to="/dashboard/documents"
            Icon={GrDocumentPdf}
            label="Documents"
            isCollapsed={isCollapsed}
          />
          <RoleChecker
            allowedRoles={["manager"]}
            allowedDepartments={["human-resource"]}
          >
            <SidebarLink
              to="/dashboard/usermanagement"
              Icon={FaCheck}
              label="User Management"
              isCollapsed={isCollapsed}
            />
          </RoleChecker>
        </div>
        <UserSidebarFooter
          isCollapsed={isCollapsed}
          name={name}
          role={role}
          isOpen={isOpen}
          toggleProfile={toggleProfile}
          handleLogout={handleLogout}
        />
      </div>
      <Verify
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you guessing to finish your tasks?"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <div
        className={`grid rounded-xl p-8 shadow-bottom bg-bg transition-all overflow-x-hidden w-full relative ${
          isCollapsed ? "ml-20" : "2xl:ml-64 ml-48"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminSidebar;
