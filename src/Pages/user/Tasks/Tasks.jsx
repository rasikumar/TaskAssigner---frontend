import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editTask } from "@/API/admin/task/task_api";
import CreateTask from "./CreateTask";
import Action from "./Action";
import Table from "@/components/customUi/Table";
import { CirclesWithBar } from "react-loader-spinner";
import { toast } from "react-toastify";
import { fetchDashBoard } from "@/API/user/dashboard/dashboard";
import RoleChecker from "@/hooks/RoleChecker";

const getpriority = (priority) => {
  switch (priority) {
    case "Critical":
      return "text-red-600 bg-red-50 rounded-md";
    case "High":
      return "text-orange-600 bg-orange-50 rounded-md";
    case "Regular":
      return "text-blue-600 bg-blue-50 rounded-md";
    case "Low":
      return "text-green-600 bg-green-50 rounded-md";
    default:
      return "text-gray-600 bg-gray-50 rounded-md";
  }
};

const getstatus = (status) => {
  switch (status) {
    case "Pending":
      return "text-red-600 rounded-md bg-red-50";
    case "In progress":
      return "text-yellow-600 rounded-md bg-yellow-50";
    case "Not started":
      return "text-blue-600 rounded-md bg-blue-50";
    case "Completed":
      return "text-green-600 rounded-md bg-green-50";
    default:
      return "text-gray-600 rounded-md bg-gray-50";
  }
};

const Tasks = () => {
  // const getRole = location.state?.data?.role || localStorage.getItem("role");
  // const role = getRole ? getRole.replace(/^"|"$/g, "") : "Loading...";
  // const allowedRole = ["team-leader", "manager"];

  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    sortBy: "created_at",
  });

  // Fetch tasks using React Query
  const { data: taskDetails, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchDashBoard,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Mutation for editing a task
  const editTaskMutation = useMutation({
    mutationFn: ({ taskId, updatedTask }) => editTask(taskId, updatedTask),
    onSuccess: () => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries(["tasks"]); // Refresh task data
    },
    onError: () => {
      toast.error("Failed to update task!");
    },
  });

  // Filtering tasks
  const filteredTasks = (taskDetails || [])
    .filter((task) => {
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.status && task.status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === "created_at") {
        return new Date(b.start_date) - new Date(a.start_date);
      }
      return 0;
    });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { key: "project_title", title: "Project Title" },
    { key: "priority", title: "Priority", className: "text-center" },
    { key: "status", title: "Status", className: "text-center" },
    { key: "report_to", title: "Report To" },
    { key: "start_date", title: "Start Date" },
    { key: "action", title: "Action", className: "text-center" },
  ];

  const renderRow = (task) => (
    <>
      <td className="px-2 py-3 text-sm flex flex-col gap-2">
        <div className="font-bold text-primary">{task.project_title}</div>
        <div className="text-slate-700">{task.project_ownership}</div>
        <div className="text-xs text-gray-500">{task.project_description}</div>
      </td>
      <td className={`px-2 py-2 text-center text-xs font-semibold`}>
        <span className={getpriority(task.priority)}>{task.priority}</span>
      </td>
      <td className={`px-2 py-2 text-center text-xs font-semibold`}>
        <span className={getstatus(task.status)}>{task.status}</span>
      </td>
      <td className="px-2 py-3 text-sm text-gray-700">{task.report_to}</td>
      <td className="px-2 py-3 text-sm text-gray-700">{task.start_date}</td>
      <td className="px-2 py-3 text-sm text-blue-500 cursor-pointer">
        <Action
          task={task}
          onEdit={(updatedTask) =>
            editTaskMutation.mutate({ taskId: task.id, updatedTask })
          }
        />
      </td>
    </>
  );

  return (
    <div className="relative h-full">
      <div className="flex justify-start gap-2 relative">
        <RoleChecker allowedRoles={["team-leader", "manager"]}>
          <CreateTask />
        </RoleChecker>
        <div className="flex gap-4 mb-4">
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="border p-2 bg-transparent"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Regular">Regular</option>
            <option value="Low">Low</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 bg-transparent"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In progress">In progress</option>
            <option value="Not started">Not started</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <CirclesWithBar color="#4fa94d" />
        </div>
      ) : (
        <Table columns={columns} data={filteredTasks} renderRow={renderRow} />
      )}
    </div>
  );
};

export default Tasks;
