// import DeleteDialog from "@/components/DeleteDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  // deleteTask,
  editTask,
  fetchAllTaskPagination,
} from "@/API/admin/task/task_api";

import RoleChecker from "@/lib/RoleChecker";
import { UserTaskDetailsModal } from "@/components/customUi/user/UserTaskDetailsModal";
import Table from "@/components/customUi/Table";
import { getpriority } from "@/utils/prorityUtils";
import { getStatus } from "@/utils/statusUtils";
import CreateTaskUser from "./CreateTasksUser";
import PaginationComponent from "@/components/customUi/PaginationComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Selector from "@/components/customUi/Selector";
import MainCards from "@/components/ui/cards/MainCards";
import { FaTasks } from "react-icons/fa";
import TableSkeleton from "@/components/loading/TableSkeleton";

const UserTasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(false);

  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // For query key

  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [itemsPerPage] = useState(10);
  const handleTaskClick = (task) => {
    setSelectedProject(task);
    setIsModalOpen(true);
  };
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    setAppliedSearchTerm(searchTerm); // Update appliedSearchTerm when button is clicked
  };

  const queryClient = useQueryClient();

  const { isLoading, data, error, isError } = useQuery({
    queryKey: ["tasks", currentPage, appliedSearchTerm, statusFilter],
    queryFn: () =>
      fetchAllTaskPagination(
        currentPage,
        itemsPerPage,
        appliedSearchTerm,
        statusFilter
      ), // Use a function reference
    staleTime: 1000 * 60, // 1 minute
  });

  const StatusSummary = data?.statusSummary;

  const updateMutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setIsModalOpen(false);
      toast.success("Project updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Failed to update project");
      console.error("Error updating project:", error);
    },
  });

  // const deleteMutation = useMutation({
  //   mutationFn: deleteTask,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["tasks"]);
  //     toast.success("Task deleted successfully!");
  //   },
  //   onError: (err) => {
  //     console.log("Error deleting task", err);
  //   },
  // });

  const handleUpdateTask = (taskId) => {
    updateMutation.mutate(taskId);
  };

  // const handleDeleteTask = (taskId) => {
  //   deleteMutation.mutate(taskId);
  // };
  // console.log(data);

  if (isError) {
    console.error(error);
  }

  const columns = [
    { key: "task_title", title: "Task Title" },
    { key: "project_name", title: "Project", className: "text-center" },
    { key: "assigned_by", title: "Assigned By", className: "text-center" },
    { key: "assigned_to", title: "Assigned To", className: "text-center" },
    { key: "start_date", title: "Start Date", className: "text-center" },
    { key: "end_date", title: "End Date", className: "text-center" },
    { key: "status", title: "Status", className: "text-center" },
    { key: "priority", title: "Priority", className: "text-center" },
  ];

  const renderRow = (task) => (
    <>
      <td
        className="px-2 py-3 text-sm"
        onClick={() => {
          handleTaskClick(task);
        }}
      >
        <div className="inline-flex flex-col">
          <span className="text-primary font-bold">
            {task.task_title || "N/A"}
          </span>
          <span className="line-clamp-3 w-80">
            {task.task_description || "N/A"}
          </span>
        </div>
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {task.project?.project_name || "N/A"} {/* Access nested field */}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {task.assigned_by?.name || "N/A"} {/* Access nested field */}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {task.assigned_to?.name || "N/A"} {/* Access nested field */}
      </td>

      <td className="px-2 py-3 text-sm text-center">
        {new Date(task.start_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) || "N/A"}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {new Date(task.end_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) || "N/A"}
      </td>
      <td className="px-2 py-2 text-center text-xs font-semibold">
        <span className={getStatus(task.status)}>{task.status || "N/A"}</span>
      </td>
      <td className="px-2 py-2 text-center text-xs font-semibold">
        <span className={getpriority(task.priority)}>
          {task.priority || "N/A"}
        </span>
      </td>
      {/* <td className="px-2 py-3 text-sm text-center">
        <DeleteDialog
          message="Are you sure you want to delete this task?"
          onConfirm={() => handleDeleteTask(task._id)}
          isLoading={deleteMutation.isPending}
        />
      </td> */}
    </>
  );

  const CompletedTask = StatusSummary?.Completed || 0;
  const InprogressTask = StatusSummary?.["In progress"] || 0;
  const NotStartedTask = StatusSummary?.["Not started"] || 0;
  const PendingTask = StatusSummary?.Pending || 0;
  const CancelledTask = StatusSummary?.Cancelled || 0;

  const statusoption = [
    { value: "", label: "All" }, // Add this line
    { value: "Not started", label: "Not Started" },
    { value: "In progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Pending", label: "Pending" },
  ];

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  return (
    <div className="relative mt-0 flex flex-col gap-4">
      <RoleChecker allowedRoles={["team lead", "manager"]}>
        <CreateTaskUser />
      </RoleChecker>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search TaskName..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex items-center gap-2">
          <Label>Status</Label>
          <Selector
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusoption}
          />
        </div>
      </div>
      <div className="flex lg:flex-nowrap gap-2">
        <MainCards
          title="Yet to Start"
          totaltasks={NotStartedTask}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#FFC107"
        />
        <MainCards
          title="Pending"
          totaltasks={PendingTask}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#007BFF"
        />
        <MainCards
          title="Cancelled"
          totaltasks={CancelledTask}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#6C757D"
        />
        <MainCards
          title="In-Progress"
          totaltasks={InprogressTask}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#B23A48"
        />
        <MainCards
          title="Completed"
          totaltasks={CompletedTask}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#28A745"
        />
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="flex flex-col justify-start gap-2 relative">
          <Table
            columns={columns}
            data={data?.uatTasks || data?.tasks || []}
            renderRow={renderRow}
          />
          <div className="mt-4">
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      )}
      {isModalOpen && (
        <UserTaskDetailsModal
          task={selectedProject}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleUpdateTask}
        />
      )}
    </div>
  );
};
export default UserTasks;
