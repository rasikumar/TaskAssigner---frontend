import { fetchAllTasks } from "@/API/task/task_api";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

const Tasks = () => {
  const [taskDetails, setTaskDetails] = useState([]);
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
      <div className="flex justify-end mt-2">
        <Button className="w-fit items-center">Create Task</Button>
      </div>
      <div className="h-[40rem] overflow-y-auto relative">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="sticky top-0 bg-gray-200 z-10">
              <th className="px-4 py-2 text-left text-sm">Project Title</th>
              <th className="px-4 py-2 text-left text-sm">Project Owner</th>
              <th className="px-4 py-2 text-left text-sm">
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
                <td className="px-4 py-2 text-sm">{task.project_title}</td>
                <td className="px-4 py-2 text-sm">{task.project_ownership}</td>
                <td className="px-4 py-2 text-sm">
                  {task.project_description}
                </td>
                <td className="px-4 py-2 text-sm">{task.task_description}</td>
                <td className="px-4 py-2 text-sm">{task.priority}</td>
                <td className="px-4 py-2 text-sm">{task.status}</td>
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
