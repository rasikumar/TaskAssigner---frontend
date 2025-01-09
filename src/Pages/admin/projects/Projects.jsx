import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProject,
  fetchAllProjects,
  updateProject,
} from "@/API/admin/projects/project_api";
import { CirclesWithBar } from "react-loader-spinner";
import { toast } from "react-toastify";
import Table from "@/components/customUi/Table"; // Import the reusable Table component
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import ShadCN pagination components
import CreateProject from "./CreateProject";
import { ProjectDetailModal } from "@/components/customUi/ProjectDetailModal";
import DeleteDialog from "@/components/DeleteDialog";
import { getTaskRelatedToProject } from "@/API/admin/task/task_api";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(false);
  const [taskList, setTaskList] = useState([]);

  const queryClient = useQueryClient();

  const handleProjectClick = (project, projectId) => {
    setSelectedProject(project);
    handleClick(projectId);
    setIsModalOpen(true);
  };
  // console.log(taskList);

  const [currentPage, setCurrentPage] = useState(1); // Track current page

  const [itemsPerPage] = useState(15);
  // Fetch Projects using React Query with pagination support
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["projects", currentPage],
    queryFn: () => fetchAllProjects(currentPage, itemsPerPage),
    staleTime: 30000,
    onError: () => toast.error("Error fetching projects"),
  });

  // console.log(data);

  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setIsModalOpen(false);
      toast.success("Project updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update project");
      console.error("Error updating project:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project deleted successfully!");
    },
    onError: (err) => {
      console.log("Error deleting project", err);
    },
  });

  const getRelatedMutations = useMutation({
    mutationFn: getTaskRelatedToProject,
    onSuccess: (data) => {
      setTaskList(data.length > 0 ? data : ["No tasks available"]);
    },
    onError: (err) => {
      console.log("Error fetching related tasks", err);
      setTaskList([]); // Set task list to empty array on error
    },
  });

  const handleClick = (projectId) => {
    getRelatedMutations.mutate(projectId, {
      onSuccess: (data) => {
        setTaskList(data.length > 0 ? data : ["No tasks available"]);
      },
    });
  };

  const handleUpdateProject = (updateProject) => {
    updateMutation.mutate(updateProject);
  };

  // console.log(data);

  const handleDeleteProject = (projectId) => {
    deleteMutation.mutate(projectId);
  };

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
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
      <td className="px-2 py-3 text-sm">{project.project_status}</td>
      <td className="px-2 py-3 text-sm text-center">
        <DeleteDialog
          message="Are you sure you want to delete this project?"
          onConfirm={() => handleDeleteProject(project._id)}
          isLoading={deleteMutation.isPending}
        />
      </td>
    </>
  );

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage); // Total number of pages

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
      {isLoading ? (
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
          <CreateProject />
          <Table
            columns={columns}
            data={data?.projects || []}
            renderRow={renderRow}
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
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleUpdateProject}
          taskList={taskList}
        />
      )}
    </div>
  );
};

export default Projects;
