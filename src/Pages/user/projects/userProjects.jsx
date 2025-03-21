import {
  fetchAllUserProjects,
  userUpdateProject,
} from "@/API/user/projects/project";
import Table from "@/components/customUi/Table";
import { UserProjectDetailModal } from "@/components/customUi/user/UserProjectDetailModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CreateProjectUser from "./CreateProjectUser";
import { Label } from "@/components/ui/label";
import Selector from "@/components/customUi/Selector";
import RoleChecker from "@/lib/RoleChecker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import PaginationComponent from "@/components/customUi/PaginationComponent";
import MainCards from "@/components/ui/cards/MainCards";
import { FaTasks } from "react-icons/fa";
import TableSkeleton from "@/components/loading/TableSkeleton";
import { getTaskRelatedToProject } from "@/API/admin/task/task_api";
import { getProjectById } from "@/API/admin/projects/project_api";  
const UserProjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [filterStatus, setFilterStatus] = useState(""); // State for filter status
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // For query key
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(15);

  const queryClient = useQueryClient();

  const handleProjectClick = (project, projectId) => {
    // setSelectedProject(project);
    handleClick(projectId);
    getProjectId.mutate(projectId);
    setIsModalOpen(true);
  };

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

  const StatusSummary = projectData?.statusSummary;
  // console.log(StatusSummary);

  const CompletedProject = StatusSummary?.Completed || 0;
  const InprogressProject = StatusSummary?.["In Progress"] || 0;
  const NotStartedProject = StatusSummary?.["Not Started"] || 0;
  const PendingProject = StatusSummary?.Pending || 0;

  const updateMutation = useMutation({
    mutationFn: userUpdateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["userProjects"]);
      setIsModalOpen(false);
      toast.success("Project updated successfully!");
    },
  });

  const getProjectId = useMutation({
    mutationFn: getProjectById,
    onSuccess: (data) => {
      setSelectedProject(data?.data);
      setIsModalOpen(true);
    },
  });

  const handleUpdateProject = (updateProject) => {
    updateMutation.mutate(updateProject);
    // console.log(updateProject);
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
    </>
  );

  const totalPages = Math.ceil((userProjectsData?.total || 0) / itemsPerPage); // Total number of pages

  return (
    <div className="relative mt-0">
      <div className="flex flex-col justify-start gap-2 relative">
        <RoleChecker
          allowedRoles={["manager"]}
          allowedDepartments={["development"]}
        >
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
        </div>
        {isUserProjectsLoading ? (
          <TableSkeleton />
        ) : (
          <Table
            columns={column}
            renderRow={renderRow}
            data={projectData?.projects || []}
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
        <UserProjectDetailModal
          project={selectedProject}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleUpdateProject}
          taskList={taskList}
        />
      )}
    </div>
  );
};

export default UserProjects;
