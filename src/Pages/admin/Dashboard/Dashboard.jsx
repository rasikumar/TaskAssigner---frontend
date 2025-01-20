import { adminDashboard } from "@/API/admin/adminDashborad";
import { fetchAllProjects } from "@/API/admin/projects/project_api";
import { fetchAllTasks } from "@/API/admin/task/task_api";
import SummaryCard from "@/components/ProjectSummaryChart";
import MainCards from "@/components/ui/cards/MainCards";
import { useQuery } from "@tanstack/react-query";
import { FaTasks } from "react-icons/fa";
import { CirclesWithBar } from "react-loader-spinner";
import { RecentProjects } from "./RecentProjects";

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["task"],
    queryFn: () => fetchAllTasks(),
  });

  const {
    data: projectData,
    isError: isProjectError,
    error: projectError,
    isLoading: isProjectLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchAllProjects,
    staleTime: 30000,
  });

  const {
    data: adminData,
    isError: isAdminError,
    isLoading: isAdminLoading,
    error: adminError,
  } = useQuery({
    queryKey: ["name"],
    queryFn: adminDashboard,
  });

  if (isAdminLoading || isLoading || isProjectLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CirclesWithBar
          color="#4fa94d"
          outerCircleColor="#4fa94d"
          innerCircleColor="#4fa94d"
          barColor="#4fa94d"
          visible={true}
        />
      </div>
    );
  }

  if (isAdminError || isProjectError || isError) {
    return (
      <div>
        Error: {adminError?.message || projectError?.message || error.message}
      </div>
    );
  }

  const tasks = data.tasks || [];
  const projects = projectData.projects || [];

  // console.log(projects);

  const CompletedProject = projects.filter(
    (project) => project.project_status === "Completed"
  );
  const InprogressProject = projects.filter(
    (project) => project.project_status === "In Progress"
  );
  const NotStartedProject = projects.filter(
    (project) => project.project_status === "Not Started"
  );
  const PendingProject = projects.filter(
    (project) => project.project_status === "Pending"
  );

  const CompletedTask = tasks.filter((task) => task.status === "Completed");
  const InprogressTask = tasks.filter((task) => task.status === "In progress");
  const NotStartedTask = tasks.filter((task) => task.status === "Not started");
  const PendingTask = tasks.filter((task) => task.status === "Pending");
  const CancelledTask = tasks.filter((task) => task.status === "Cancelled");

  const projectDataForChart = [
    {
      browser: "Completed",
      visitors: CompletedProject.length,
      color: "#4CAF50",
    },
    {
      browser: "In Progress",
      visitors: InprogressProject.length,
      color: "#FFC107",
    },
    {
      browser: "Pending",
      visitors: PendingProject.length,
      color: "#15B097",
    },
    {
      browser: "Not Started",
      visitors: NotStartedProject.length,
      color: "#F44336",
    },
  ];

  const taskDataForChart = [
    {
      browser: "Completed",
      visitors: CompletedTask.length,
      color: "#4CAF50",
    },
    {
      browser: "In Progress",
      visitors: InprogressTask.length,
      color: "#FFC107",
    },
    {
      browser: "Not Started",
      visitors: NotStartedTask.length,
      color: "#2F195F",
    },
    {
      browser: "Pending",
      visitors: PendingTask.length,
      color: "#A2C5AC",
    },
    {
      browser: "Cancelled",
      visitors: CancelledTask.length,
      color: "#F44336",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <header className="bg-gradient-to-r w-full from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-extrabold mb-2 tracking-wide">
          Welcome,{" "}
          <span className="text-yellow-300">
            {adminData?.data.mail || "Admin"}!
          </span>
        </h1>
        <p className="text-base font-medium">
          We&apos;re glad to see you back. 🚀 Here&apos;s a quick overview of
          your tasks:
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Column */}
        <div className="flex flex-col gap-6">
          <h1 className="text-lg font-semibold inline-flex items-center gap-10 w-full">
            Projects{" "}
          </h1>
          {projects.length === 0 ? (
            <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-lg shadow">
              <p className="text-gray-500 text-lg font-medium">
                No Projects available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
              <MainCards
                title="Total Projects"
                totaltasks={projects.length}
                Icon={FaTasks}
                subtitle="Projects"
                bgColor="#B23A48"
              />
              <MainCards
                title="In-progress"
                btn="View All"
                totaltasks={InprogressProject.length}
                Icon={FaTasks}
                subtitle="Projects"
                bgColor="#DCA74B"
                path="./projects"
              />
              <MainCards
                title="Completed"
                btn="View All"
                totaltasks={CompletedProject.length}
                Icon={FaTasks}
                subtitle="Projects"
                bgColor="#566E3D"
                path="./projects"
              />
            </div>
          )}

          <h1 className="text-lg font-semibold inline-flex items-center gap-10 w-full">
            Tasks{" "}
          </h1>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-lg shadow">
              <p className="text-gray-500 text-lg font-medium">
                No tasks available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
              <MainCards
                title="Total Tasks"
                totaltasks={tasks.length}
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
                path="./tasks"
              />
              <MainCards
                title="Completed"
                btn="View All"
                totaltasks={CompletedTask.length}
                Icon={FaTasks}
                subtitle="Task"
                bgColor="#566E3D"
                path="./tasks"
              />
            </div>
          )}
        </div>

        {/* Second Column */}
        <div className="grid 2xl:grid-cols-2 gap-4">
          <SummaryCard
            title="Project Status"
            description="Project Completion Overview"
            chartData={projectDataForChart}
            chartConfig={{
              Completed: { label: "Completed", color: "#4CAF50" },
              "In Progress": { label: "In Progress", color: "#FFC107" },
              "Not Started": { label: "Not Started", color: "#F44336" },
            }}
          />
          <SummaryCard
            title="Task Status"
            description="Task Completion Overview"
            chartData={taskDataForChart}
            chartConfig={{
              Completed: { label: "Completed", color: "#4CAF50" },
              "In Progress": { label: "In Progress", color: "#FFC107" },
              "Not Started": { label: "Not Started", color: "#F44336" },
            }}
          />
        </div>
      </section>

      <RecentProjects projectData={projects} />
    </section>
  );
};

export default Dashboard;
