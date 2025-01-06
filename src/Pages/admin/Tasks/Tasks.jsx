import { fetchAllTasks } from "@/API/admin/task/task_api";
import Table from "@/components/customUi/Table";
import DeleteDialog from "@/components/DeleteDialog";
import { useQuery } from "@tanstack/react-query";
import { CirclesWithBar } from "react-loader-spinner";
import CreateTask from "./CreateTask";

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
  const {
    isLoading,
    data: tasks,
    error,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchAllTasks,
    staleTime: 1000 * 60, // 1 minute
  });
  // console.log(tasks);

  if (isError) {
    console.error(error);
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

  const renderRow = (task) => (
    <>
      <td
        onClick={() => {
          handleProjectClick(task);
        }}
        className="px-2 py-3 text-sm text-primary font-bold "
      >
        {task.task_title}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {task.project_ownership || "No name available"}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {task.estimated_hours || "not"}
      </td>
      <td className="px-2 py-3 text-sm">
        {new Date(task.start_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) || "not"}
      </td>
      <td className="px-2 py-3 text-sm">
        {new Date(task.end_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) || "not"}
      </td>
      <td className={`px-2 py-2 text-center text-xs font-semibold`}>
        <span className={getstatus(task.status)}>{task.status || "not"}</span>
      </td>
      <td className={`px-2 py-2 text-center text-xs font-semibold`}>
        <span className={getpriority(task.priority)}>
          {task.priority || "not"}
        </span>
      </td>
      <td className="px-2 py-3 text-sm">
        {/* <DeleteDialog
          message="Are you sure you want to delete this project?"
          onConfirm={() => handleDeleteProject(project._id)}
          isLoading={deleteMutation.isPending}
        /> */}
      </td>
    </>
  );

  return (
    <div className="relative mt-0 flex flex-col gap-4">
      <CreateTask />
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
          <Table columns={columns} data={tasks} renderRow={renderRow} />
        </div>
      )}
    </div>
  );
};
export default Tasks;
