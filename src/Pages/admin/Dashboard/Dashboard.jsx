import { adminDashboard } from "@/API/admin/adminDashborad";
import { fetchAllProjects } from "@/API/admin/projects/project_api";
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

  const {
    data: projectData,
    isError: isProjectError,
    error: projectError,
    isLoading: isProjectLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchAllProjects(),
    staleTime: 30000, // Cache projects for 30 seconds
    onError: (err) => console.error("Project", err),
  });

  const {
    data: adminData,
    isError: isAdminError,
    isLoading: isAdminLoading,
    error: adminError,
  } = useQuery({
    queryKey: ["name"],
    queryFn: () => {
      return adminDashboard();
    },
  });

  if (isAdminLoading) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isProjectLoading) {
    return <div>Loading...</div>;
  }
  if (isAdminError) {
    return <div>Error: {adminError.message}</div>;
  }

  if (isProjectError) {
    return <div>Error: {projectError.message}</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const tasks = data || {};
  const projects = projectData.projects || {};

  // console.log("Tasks:", projects);
  const CompletedProject = projects.filter(
    (project) => project.project_status === "Completed"
  );
  const InprogressProject = projects.filter(
    (project) => project.project_status === "Pending"
  );
  const NotStartedProject = projects.filter(
    (project) => project.project_status === "Not Started"
  );

  const CompletedTask = tasks.filter((task) => task.status === "Completed");
  const InprogressTask = tasks.filter((task) => task.status === "In progress");
  const NotStartedTask = tasks.filter((task) => task.status === "Not started");

  return (
    <section className="flex flex-col gap-4">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-3xl font-extrabold mb-2 tracking-wide">
          Welcome,{" "}
          <span className="text-yellow-300">
            {adminData?.data.mail || "Admin"}!
          </span>
        </h1>
        <p className="text-lg font-medium">
          We&apos;re glad to see you back. 🚀 Here&apos;s a quick overview of
          your tasks:
        </p>
      </header>

      <section className="flex 2xl:flex-nowrap md:flex-wrap w-full gap-6">
        {/* First Column */}
        <div className="flex flex-col w-full">
          {/* Projects Section */}
          <h1 className="text-lg font-semibold my-4">Projects</h1>
          <div className="flex gap-4">
            <MainCards
              title="Yet to Start"
              btn="View All"
              totaltasks={NotStartedProject.length} // Fix task count
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#B23A48"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={InprogressProject.length} // Fix task count
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#DCA74B"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={CompletedProject.length} // Fix task count
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
    </section>
  );
};

export default Dashboard;
