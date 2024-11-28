import { editTask, fetchAllTasks } from "@/API/admin/task/task_api";
// import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import CreateTask from "./CreateTask";
import Action from "./Action";

const getpriority = (priority) => {
  switch (priority) {
    case "Critical":
      return "text-red-600 bg-red-50  rounded-md";
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
  const [taskDetails, setTaskDetails] = useState([]);
  // const [showTaskModal, setShowTaskModal] = useState(false);
  useEffect(() => {
    const getTasks = async () => {
      try {
        const task = await fetchAllTasks();
        console.log(task.data);
        setTaskDetails(task.data);
      } catch (error) {
        console.error(error);
      }
    };
    getTasks();
  }, []);

  const handleEditTask = async (taskId, updatedTask) => {
    console.log("Editing Task:", updatedTask);
    console.log("Editing Task:", taskId);

    if (!updatedTask) {
      console.error("UpdatedTask is missing!");
      return;
    }

    try {
      console.log("Sending data to editTask function...");
      const updatedData = await editTask(taskId, updatedTask);

      console.log("Received updated data:", updatedData);

      setTaskDetails((prevTasks) => {
        console.log("Previous tasks before update:", prevTasks);

        const updatedTasks = prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );

        console.log("Tasks after update:", updatedTasks);
        return updatedTasks;
      });

      console.log("Task updated successfully:", updatedData);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTaskDetails((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  return (
    <div className="2xl:w-[103rem] w-[63rem]  bg-blue-50">
      <div className="flex p-2 pl-4 w-full justify-start gap-2 relative mt-2">
        <CreateTask />
      </div>
      <div className="h-full w-[98%] rounded-xl m-auto overflow-y-auto relative ">
        <table className="table-auto border-collapse mt-4 m-auto text-xs shadow-md rounded-lg overflow-hidden bg-white">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-12">
            <tr className="sticky top-0">
              <th className="px-5 py-2 text-left font-semibold min-w-52">
                Project Title
              </th>
              {/* <th className="px-2 py-2 text-left font-semibold">
                Project Owner
              </th>
              <th className="px-2 py-2 text-left font-semibold w-1/4">
                Project Description
              </th> */}
              <th className="px-2 py-2 text-left font-semibold ">
                Task Description
              </th>
              <th className="px-2 py-2 text-center font-semibold">Priority</th>
              <th className="px-2 py-2 text-center font-semibold">Status</th>
              <th className="px-2 py-2 text-left font-semibold">Report To</th>
              <th className="px-2 py-2 text-left font-semibold min-w-56">
                Start Date
              </th>
              <th className="px-5 py-2 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {taskDetails.map((task, index) => (
              <tr
                key={task.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors duration-150 ease-in-out border-b cursor-pointer`}
              >
                <td className="px-2 py-3 text-sm flex flex-col gap-2">
                  <div className="font-bold text-primary">
                    {task.project_title}
                  </div>
                  <div className="text-slate-700">{task.project_ownership}</div>
                  <div className="text-xs text-gray-500">
                    {task.project_description}
                  </div>
                </td>
                {/* <td className="px-2 py-3 text-sm font-medium text-gray-700">
                </td>
                <td className="px-2 py-3 text-sm text-gray-600 truncate">
                </td>*/}
                <td className="px-2 py-3 text-sm text-gray-600 truncate max-w-52">
                  {task.task_description}
                </td>
                <td className={`px-2 py-2 text-center text-xs font-semibold`}>
                  <span
                    className={`px-2 py-2 text-center text-xs font-semibold ${getpriority(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td
                  className={`px-2 py-2 text-center text-xs font-semibold min-w-32`}
                >
                  <span
                    className={`px-2 py-2 text-center text-xs font-semibold ${getstatus(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-2 py-3 text-sm text-gray-700">
                  {task.report_to}
                </td>
                <td className="px-2 py-3 text-sm text-gray-700">
                  {task.start_date}
                </td>
                <td className="px-2 py-3 text-sm text-blue-500 cursor-pointer">
                  <Action
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
