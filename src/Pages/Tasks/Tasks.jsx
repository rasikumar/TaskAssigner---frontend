import { fetchAllTasks } from "@/API/task/task_api";
// import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import CreateTask from "./CreateTask";

const getpriority = (priority) => {
  switch (priority) {
    case "Critical":
      return "text-red-600";
    case "High":
      return "text-orange-600";
    case "Regular":
      return "text-blue-600";
    case "Low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

const getstatus = (status) => {
  switch (status) {
    case "Pending":
      return "text-red-600";
    case "In progress":
      return "text-yellow-600";
    case "Not started":
      return "text-blue-600";
    case "Completed":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};
const Tasks = () => {
  const [taskDetails, setTaskDetails] = useState([]);
  // const [showTaskModal, setShowTaskModal] = useState(false);
  useEffect(() => {
    const getTasks = async () => {
      try {
        const task = await fetchAllTasks();
        setTaskDetails(task.data);
        console.log(task.data);
      } catch (error) {
        console.error(error);
      }
    };
    getTasks();
  }, []);
  return (
    <div className="scroll flex flex-col gap-2 relative">
      <div className="flex w-full justify-end gap-2 relative mt-2">
        <CreateTask />
      </div>
      <div className="h-full overflow-y-auto relative mt-10">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="sticky top-0 bg-gray-200 z-10">
              <th className="px-4 py-2 text-left text-sm">Project Title</th>
              <th className="px-4 py-2 text-left text-sm">Project Owner</th>
              <th className="px-4 py-2 text-left text-sm w-1/4">
                Project Description
              </th>
              <th className="px-4 py-2 text-left text-sm">Task Description</th>
              <th className="px-4 py-2 text-left text-sm">Priority</th>
              <th className="px-4 py-2 text-left text-sm">Status</th>
              <th className="px-4 py-2 text-left text-sm">Report To</th>
              <th className="px-4 py-2 text-left text-sm">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {taskDetails.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="px-4 py-2 text-sm text-pretty text-primary">
                  {task.project_title}
                </td>
                <td className="px-4 py-2 text-sm">{task.project_ownership}</td>
                <td className="px-4 py-2 text-sm">
                  {task.project_description}
                </td>
                <td className="px-4 py-2 text-sm">{task.task_description}</td>
                <td
                  className={`text-primary text-sm rounded-md text-center  ${getpriority(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </td>
                <td className={`px-4 py-2 text-sm  ${getstatus(task.status)}`}>
                  {task.status}
                </td>
                <td className="px-4 py-2 text-sm">{task.report_to}</td>
                <td className="px-4 py-2 text-sm">{task.start_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
