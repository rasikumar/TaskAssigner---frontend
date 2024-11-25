import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import Verify from "./ui/verify";
import { FaDashcube, FaTasks, FaTicketAlt } from "react-icons/fa";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarMenuButton,
} from "./ui/sidebar";
import DynamicBreadCrumb from "./DynamicBreadCrumb";
import {
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent } from "./ui/dropdown-menu";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronsUpDown, Menu, X } from "lucide-react";
import { GrUserManager } from "react-icons/gr";
import Instance from "@/API/Instance";
import clsx from "clsx";

const Sidebars = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const responseName = async () => {
      try {
        const response = await Instance.get("/admin/dashboard/");
        setName(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    responseName();
  }, []);

  return (
    <div className="flex absolute">
      {/* Sidebar */}
      <SidebarProvider
        className={`flex flex-col border border-orange-500 bg-white transition-all h-full fixed  duration-300 z-[9999] ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <SidebarHeader className="text-lg font-bold">
            {!isCollapsed && "Dashboard Sidebar"}
          </SidebarHeader>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md transition"
          >
            {isCollapsed ? (
              <Menu
                size={40}
                className="items-center -ml-[26px] rounded-md transition-all hover:bg-orange-500 p-2 "
              />
            ) : (
              <X
                size={40}
                className="items-center rounded-md transition-all hover:bg-orange-500 p-2 "
              />
            )}
          </button>
        </div>
        <SidebarContent className="flex flex-col gap-4 mt-4">
          {/* Links with centered icons */}
          <Link
            to="/dashboard"
            className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "justify-center" : "px-4"
            }`}
          >
            <FaDashcube className="text-xl" />
            {!isCollapsed && <span className="ml-2">Dashboard</span>}
          </Link>

          <Link
            to="/dashboard/manager"
            className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "justify-center" : "px-4"
            }`}
          >
            <GrUserManager className="text-xl" />
            {!isCollapsed && <span className="ml-2">Manager</span>}
          </Link>

          <Link
            to="/dashboard/human-resource"
            className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "justify-center" : "px-4"
            }`}
          >
            <GrUserManager className="text-xl" />
            {!isCollapsed && <span className="ml-2">Human Resource</span>}
          </Link>

          <Link
            to="/dashboard/team-leader"
            className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "justify-center" : "px-4"
            }`}
          >
            <GrUserManager className="text-xl" />
            {!isCollapsed && <span className="ml-2">Team Leader</span>}
          </Link>

          <Link
            to="/dashboard/employee"
            className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "justify-center" : "px-4"
            }`}
          >
            <GrUserManager className="text-xl" />
            {!isCollapsed && <span className="ml-2">Employee</span>}
          </Link>

          <Link
            to="/dashboard/tasks"
            className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "justify-center" : "px-4"
            }`}
          >
            <FaTasks className="text-xl" />

            {!isCollapsed && <span className="ml-2">Tasks</span>}
          </Link>

          <Link
            to="/dashboard/ticket"
            className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "justify-center" : "px-4"
            }`}
          >
            <FaTicketAlt className="text-xl" />

            {!isCollapsed && <span className="ml-2">Tickets</span>}
          </Link>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">as</span>
                    <span className="truncate text-xs">asd</span>
                  </div>
                )}
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">as</span>
                    <span className="truncate text-xs">asas</span>
                  </div>
                </div>
                <Link
                  onClick={() => setShowLogoutModal(true)}
                  className="text-red-500 hover:underline items-end justify-end text-sm"
                >
                  Logout
                </Link>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </SidebarProvider>
      <Verify
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you guessing to finish your tasks?"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
      <div
        className={clsx(
          "p-4 w-full z-50 bg-white transition-all",
          isCollapsed ? "ml-14" : "ml-60"
        )}
      >
        <div className="w-full">
          <DynamicBreadCrumb />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebars;
