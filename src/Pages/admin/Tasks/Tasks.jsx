import Table from "@/components/customUi/Table";
import DeleteDialog from "@/components/DeleteDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclesWithBar } from "react-loader-spinner";
import CreateTask from "./CreateTask";
import { useState } from "react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
import {
  deleteTask,
  editTask,
  fetchAllTaskPagination,
} from "@/API/admin/task/task_api";
import { TaskDetailsModal } from "@/components/customUi/admin/TaskDetailModal";
import { toast } from "react-toastify";
import { getStatus } from "@/utils/statusUtils";
import { getpriority } from "@/utils/prorityUtils";
import { Input } from "@/components/ui/input";
import MainCards from "@/components/ui/cards/MainCards";
import { FaTasks } from "react-icons/fa";
import PaginationComponent from "@/components/customUi/PaginationComponent";

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Track current page

  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const handleTaskClick = (task) => {
    setSelectedProject(task);
    setIsModalOpen(true);
  };

  const queryClient = useQueryClient();

  const { isLoading, data, error, isError } = useQuery({
    queryKey: ["tasks", currentPage],
    queryFn: () => fetchAllTaskPagination(currentPage, itemsPerPage), // Use a function reference
    staleTime: 1000 * 60, // 1 minute
  });
  const sortedTasks = (data?.tasks || []).sort(
    (a, b) => new Date(b.start_date) - new Date(a.start_date)
  );
  // const StatusSummary = data.statusSummary;
  // console.log(StatusSummary.Cancelled);

  const updateMutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setIsModalOpen(false);
      toast.success("Project updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update project");
      console.error("Error updating project:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task deleted successfully!");
    },
    onError: (err) => {
      console.log("Error deleting task", err);
    },
  });

  const handleUpdateTask = (taskId) => {
    updateMutation.mutate(taskId);
  };

  const handleDeleteTask = (taskId) => {
    deleteMutation.mutate(taskId);
  };

  if (isError) {
    console.error(error);
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredTasks = sortedTasks.filter((task) => {
    const matchesSearch = task.task_title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const CompletedTask = filteredTasks.filter(
    (task) => task.status === "Completed"
  );
  const InprogressTask = filteredTasks.filter(
    (task) => task.status === "In progress"
  );
  const NotStartedTask = filteredTasks.filter(
    (task) => task.status === "Not started"
  );
  const PendingTask = filteredTasks.filter((task) => task.status === "Pending");
  const CancelledTask = filteredTasks.filter(
    (task) => task.status === "Cancelled"
  );

  const columns = [
    { key: "task_title", title: "Task Title" },
    { key: "project_name", title: "Project", className: "text-center" },
    { key: "assigned_by", title: "Assigned By", className: "text-center" },
    { key: "assigned_to", title: "Assigned To", className: "text-center" },
    { key: "start_date", title: "Start Date", className: "text-center" },
    { key: "end_date", title: "End Date", className: "text-center" },
    { key: "status", title: "Status", className: "text-center" },
    { key: "priority", title: "Priority", className: "text-center" },
    { key: "action", title: "Action", className: "text-center" },
  ];

  const renderRow = (task) => (
    <>
      <td
        className="px-2 py-3 text-sm"
        onClick={() => {
          handleTaskClick(task, task.project?._id);
        }}
      >
        <div className="inline-flex flex-col">
          <span className="text-primary font-bold">
            {task.task_title || "N/A"}
          </span>
          <span className="line-clamp-3 w-64">
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
      <td className="px-2 py-3 text-sm text-center">
        {/* Add Delete or Edit Actions */}
        <DeleteDialog
          message="Are you sure you want to delete this task?"
          onConfirm={() => handleDeleteTask(task._id)}
          isLoading={deleteMutation.isPending}
        />
      </td>
    </>
  );

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  return (
    <div className="relative mt-0 flex flex-col gap-4">
      <CreateTask />
      {/* Add filter search and status dropdown */}
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/4"
        />
        <select
          className="appearance-none w-32 text-center rounded-xl"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="Not started">Not Started</option>
          <option value="In progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div className="flex lg:flex-nowrap gap-2">
        <MainCards
          title="Yet to Start"
          totaltasks={NotStartedTask.length}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#B23A48"
        />
        <MainCards
          title="Pending"
          totaltasks={PendingTask.length}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#B23A48"
        />
        <MainCards
          title="Cancelled"
          totaltasks={CancelledTask.length}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#B23A48"
        />
        <MainCards
          title="In-Progress"
          totaltasks={InprogressTask.length}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#B23A48"
        />
        <MainCards
          title="Completed"
          totaltasks={CompletedTask.length}
          Icon={FaTasks}
          subtitle="Task"
          bgColor="#B23A48"
        />
      </div>
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
          <Table
            columns={columns}
            data={filteredTasks || []} // Use filteredTasks instead of sortedTasks
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
        <TaskDetailsModal
          task={selectedProject}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleUpdateTask}
        />
      )}
    </div>
  );
};
export default Tasks;
