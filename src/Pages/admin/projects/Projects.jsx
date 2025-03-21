import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { FaTasks } from "react-icons/fa";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  deleteProject,
  fetchAllProjects,
  updateProject,
} from "@/API/admin/projects/project_api";
import { getTaskRelatedToProject } from "@/API/admin/task/task_api";
import { getProjectById } from "@/API/admin/projects/project_api";

import Table from "@/components/customUi/Table"; // Import the reusable Table component
import { ProjectDetailModal } from "@/components/customUi/admin/ProjectDetailModal";
import DeleteDialog from "@/components/DeleteDialog";
import Selector from "@/components/customUi/Selector";
import MainCards from "@/components/ui/cards/MainCards";
import PaginationComponent from "@/components/customUi/PaginationComponent";

import { getStatus } from "@/utils/statusUtils";

import CreateProject from "./CreateProject";
import TableSkeleton from "@/components/loading/TableSkeleton";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // For query key
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filterStatus, setFilterStatus] = useState(""); // State for filter status

  const queryClient = useQueryClient();

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    setAppliedSearchTerm(searchTerm); // Update appliedSearchTerm when button is clicked
  };

  const handleProjectClick = (project, projectId) => {
    // setSelectedProject(project);
    handleClick(projectId);
    getProjectId.mutate(projectId);
    setIsModalOpen(true);
  };
  // console.log(taskList);

  const [currentPage, setCurrentPage] = useState(1); // Track current page

  const [itemsPerPage] = useState(15);
  // Fetch Projects using React Query with pagination support
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["projects", currentPage, appliedSearchTerm, filterStatus],
    queryFn: () =>
      fetchAllProjects(
        currentPage,
        itemsPerPage,
        appliedSearchTerm,
        filterStatus
      ),
    staleTime: 30000,
    onError: () => toast.error("Error fetching projects"),
  });

  const StatusSummary = data?.statusSummary;
  // console.log(StatusSummary);

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
  const getProjectId = useMutation({
    mutationFn: getProjectById,
    onSuccess: (data) => {
      setSelectedProject(data?.data);
      setIsModalOpen(true);
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

  const CompletedProject = StatusSummary?.Completed || 0;
  const InprogressProject = StatusSummary?.["In Progress"] || 0;
  const NotStartedProject = StatusSummary?.["Not Started"] || 0;
  const PendingProject = StatusSummary?.Pending || 0;
  // const CancelledProject = StatusSummary?.Cancelled || 0;

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

  const statusoption = [
    { value: "", label: "All" }, // Add this line
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
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
      <td className={`px-2 py-3 text-sm ${getStatus(project.project_status)}`}>
        {project.project_status}
      </td>
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

  return (
    <div className="relative mt-0">
      <div className="flex flex-col justify-start gap-2 relative">
        <CreateProject />
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
        <div className="flex gap-2">
          <MainCards
            title="Yet to Start"
            totaltasks={NotStartedProject}
            Icon={FaTasks}
            subtitle="Task"
            bgColor="#FFC107" // Amber
          />
          <MainCards
            title="In Progress"
            totaltasks={InprogressProject}
            Icon={FaTasks}
            subtitle="Task"
            bgColor="#007BFF" // Blue
          />
          <MainCards
            title="Pending"
            totaltasks={PendingProject}
            Icon={FaTasks}
            subtitle="Task"
            bgColor="#6C757D" // Grey
          />
          <MainCards
            title="Completed"
            totaltasks={CompletedProject}
            Icon={FaTasks}
            subtitle="Task"
            bgColor="#28A745" // Green
          />

          {/* <MainCards
              title="Yet to Start"
              totaltasks={CancelledProject}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#B23A48"
            /> */}
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <Table
            columns={columns}
            data={data?.projects || []}
            renderRow={renderRow}
          />
        )}
        <div className="mt-4">
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
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
