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
  FaCode,
  FaPalette,
  FaBullhorn,
  FaFlask,
  FaUsers,
} from "react-icons/fa";
import { GrDocumentPdf, GrUserManager } from "react-icons/gr";
// import { teams } from "@/data/teams";
import { Outlet, useNavigate } from "react-router";
import UserSidebarFooter from "./SideBar/UserSidebarFooter";
import RoleChecker from "@/lib/RoleChecker";
import { cn } from "@/lib/utils";
import Teams from "@/hooks/teams/Teams";

const selectItemsData = [
  {
    id: 1,
    value: "development",
    label: "Development",
    icon: <FaCode />, // Better represents coding/development
  },
  {
    id: 2,
    value: "design",
    label: "Design",
    icon: <FaPalette />, // Represents creative design
  },
  {
    id: 3,
    value: "marketing",
    label: "Marketing",
    icon: <FaBullhorn />, // Represents marketing/advertising
  },
  {
    id: 4,
    value: "testing",
    label: "Testing",
    icon: <FaFlask />, // Represents testing/experimentation
  },
  {
    id: 5,
    value: "human-resource",
    label: "Human Resource",
    icon: <FaUsers />, // Represents people/team
  },
];

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

  // const getDepartment =
  //   location.state?.data?.department || localStorage.getItem("department");
  // const department = getDepartment
  //   ? getDepartment.replace(/^"|"$/g, "")
  //   : "Loading...";

  // // Filter selectItemsData based on department
  // const filteredSelectItemsData = selectItemsData.filter(
  //   (item) => item.value === department
  // );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("mail");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  // console.log(name);
  const userTeamsHook = Teams;

  const { userGetAllEmpByDepartment } = userTeamsHook();

  const handleTeamSelect = (team) => {
    userGetAllEmpByDepartment.mutate(team?.value, {
      onSuccess: (data) => {
        navigate(`/dashboard/teams/${team?.value}`, {
          state: { data },
        });
      },
      onError: (error) => {
        console.error("Error fetching employees:", error);
      },
    });
  };

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
          <RoleChecker allowedRoles={["manager"]}>
            <Dropdown
              isCollapsed={isCollapsed}
              label="Team Management"
              Icon={GrUserManager}
              links={selectItemsData.map((team) => ({
                to: `./teams/${team.value}`,
                label: team.label,
                icon: team.icon,
                value: team.value,
              }))}
              onSelect={handleTeamSelect}
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
          <RoleChecker allowedRoles={["manager", "team lead", "member"]}>
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
