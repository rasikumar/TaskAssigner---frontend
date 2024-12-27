import { fetchAllTasks } from "@/API/admin/task/task_api";
import MainCards from "@/components/ui/cards/MainCards";
import { useQuery } from "@tanstack/react-query";

import { FaTasks } from "react-icons/fa";

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["task"],
    queryFn: () => {
      return fetchAllTasks();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const tasks = data || {};

  // console.log("Tasks:", tasks);  

  const CompletedTask = tasks.filter((task) => task.status === "Completed");
  const InprogressTask = tasks.filter((task) => task.status === "In progress");
  const NotStartedTask = tasks.filter((task) => task.status === "Not started");

  return (
    <div className="flex flex-col gap-4">
      <section className="flex 2xl:flex-nowrap md:flex-wrap w-full gap-6">
        {/* First Column */}
        <div className="flex flex-col w-full">
          {/* Projects Section */}
          <h1 className="text-lg font-semibold my-4">Projects</h1>
          <div className="flex gap-4">
            <MainCards
              title="Yet to Start"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#B23A48"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#DCA74B"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#566E3D"
            />
          </div>

          {/* Tasks Section */}
          <h1 className="text-lg font-semibold my-4">Tasks</h1>
          <div className="flex gap-4">
            <MainCards
              title="Yet to Start"
              btn="View All"
              totaltasks={NotStartedTask.length}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#B23A48"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={InprogressTask.length}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#DCA74B"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={CompletedTask.length}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#566E3D"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="grid grid-cols-1 mt-[3.7rem] w-full gap-4">
          {/* Today's Tasks Section */}
          <MainCards
            title="Today's Tasks"
            btn="View All"
            totaltasks={12}
            Icon={FaTasks}
            subtitle="Task"
            bgColor="#7B4597"
          />
        </div>
      </section>
      <section className="bg-[#1A659E] h-96 rounded-xl"></section>
    </div>
  );
};

export default Dashboard;
