import {
  fetchAllUserProjects,
  userUpdateProject,
} from "@/API/user/projects/project";
import Table from "@/components/customUi/Table";
import { UserProjectDetailModal } from "@/components/customUi/user/UserProjectDetailModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CreateProjectUser from "./CreateProjectUser";
import { CirclesWithBar } from "react-loader-spinner";
import { Label } from "@/components/ui/label";
import Selector from "@/components/customUi/Selector";
import RoleChecker from "@/hooks/RoleChecker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const UserProjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState(""); // State for filter status
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // For query key
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(15);

  const queryClient = useQueryClient();

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    setAppliedSearchTerm(searchTerm); // Update appliedSearchTerm when button is clicked
  };

  const {
    isLoading: isUserProjectsLoading,
    error: userProjectsError,
    isError: isUserProjectsError,
    data: userProjectsData,
  } = useQuery({
    queryKey: ["userProjects", currentPage, appliedSearchTerm, filterStatus],
    queryFn: () =>
      fetchAllUserProjects(
        currentPage,
        itemsPerPage,
        appliedSearchTerm,
        filterStatus
      ),
    staleTime: 30000,
    onError: () => toast.error("Error fetching projects"),
  });

  const projectData = userProjectsData?.data;
  // console.log(projectData);

  const updateMutation = useMutation({
    mutationFn: userUpdateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["userProjects"]);
      setIsModalOpen(false);
      toast.success("Project updated successfully!");
    },
  });

  const handleUpdateProject = (updateProject) => {
    updateMutation.mutate(updateProject);
    console.log(updateProject);
  };

  if (isUserProjectsError) return <div>Error: {userProjectsError.message}</div>;

  const column = [
    { key: "project_title", title: "Project Title" },
    {
      key: "project_ownership",
      title: "Project Ownership",
      className: "text-center",
    },
    { key: "estimated_hours", title: "Total Hours", className: "text-center" },
    { key: "start_date", title: "Start Date" },
    { key: "end_date", title: "End Date" },
    { key: "status", title: "Status" },
    { key: "action", title: "Action", className: "text-center" },
  ];

  const statusoption = [
    { value: "", label: "All" },
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const getstatus = (status) => {
    switch (status) {
      case "Pending":
        return "text-red-600 rounded-md bg-red-50";
      case "Cancelled":
        return "text-orange-600 rounded-md bg-orange-50";
      case "In progress":
        return "text-yellow-600 rounded-md bg-yellow-50";
      case "Not Started":
        return "text-blue-600 rounded-md bg-blue-50";
      case "Completed":
        return "text-green-600 rounded-md bg-green-50";
      default:
        return "text-gray-600 rounded-md bg-gray-50";
    }
  };
  const renderRow = (project) => (
    <>
      <td
        onClick={() => {
          handleProjectClick(project, project._id); // Pass projectId here
        }}
        className="px-2 py-3 text-sm text-primary font-bold "
      >
        {project.project_name}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {project.project_ownership.name || "No name available"}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {project.estimated_hours}
      </td>
      <td className="px-2 py-3 text-sm">
        {new Date(project.startDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </td>
      <td className="px-2 py-3 text-sm">
        {new Date(project.endDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </td>
      <td className="px-2 py-2 text-center text-xs font-semibold">
        <span className={`${getstatus(project.project_status)}`}>
          {project.project_status}
        </span>
      </td>
      <td className="px-2 py-3 text-sm text-center"></td>
    </>
  );

  const totalPages = Math.ceil((userProjectsData?.total || 0) / itemsPerPage); // Total number of pages

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem
            key={i}
            onClick={() => setCurrentPage(i)}
            className={
              currentPage === i ? "rounded-lg bg-taskBlack text-white" : ""
            }
          >
            <PaginationLink>{i}</PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      if (currentPage > 1) {
        items.push(
          <PaginationItem
            key={1}
            onClick={() => setCurrentPage(1)}
            className={
              currentPage === 1 ? "rounded-lg bg-taskBlack text-white" : ""
            }
          >
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-prev">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem
            key={i}
            onClick={() => setCurrentPage(i)}
            className={
              currentPage === i ? "rounded-lg bg-taskBlack text-white" : ""
            }
          >
            <PaginationLink>{i}</PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-next">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if (currentPage < totalPages) {
        items.push(
          <PaginationItem
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={
              currentPage === totalPages
                ? "rounded-lg bg-taskBlack text-white"
                : ""
            }
          >
            <PaginationLink>{totalPages}</PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="relative mt-0">
      {isUserProjectsLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <CirclesWithBar
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#4fa94d"
            visible={true}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-start gap-2 relative">
          <RoleChecker allowedRoles={["manager"]}>
            <CreateProjectUser />
          </RoleChecker>
          <div className="flex justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update only searchTerm
                className="p-2 border rounded w-64"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <div className="flex items-center gap-x-2">
              <Label>Status</Label>
              <Selector
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={statusoption}
                className="w-48"
              />
            </div>
          </div>
          <Table
            columns={column}
            renderRow={renderRow}
            data={projectData?.projects}
          />
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || totalPages === 0} // Disable if no previous page or no pages
                  className={
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  } // Add styles to indicate disabled state
                />
                {renderPaginationItems()}
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0} // Disable if no next page or no pages
                  className={
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } // Add styles to indicate disabled state
                />
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
      {isModalOpen && (
        <UserProjectDetailModal
          project={selectedProject}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleUpdateProject}
        />
      )}
    </div>
  );
};

export default UserProjects;
