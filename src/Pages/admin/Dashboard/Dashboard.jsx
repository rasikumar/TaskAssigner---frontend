import { adminDashboard } from "@/API/admin/adminDashborad";
import { fetchAllProjects } from "@/API/admin/projects/project_api";
import { fetchAllTasks } from "@/API/admin/task/task_api";
import SummaryCard from "@/components/ProjectSummaryChart";
import MainCards from "@/components/ui/cards/MainCards";
import { useQuery } from "@tanstack/react-query";
import { FaTasks } from "react-icons/fa";
import { RecentProjects } from "./RecentProjects";
import { VscLoading } from "react-icons/vsc";

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchAllTasks(),
  });
  const StatusSummary = data?.statusSummary;

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
  const StatusSummaryforProject = projectData?.statusSummary;
  // console.log(projectData);

  const {
    data: adminData,
    isError: isAdminError,
    isLoading: isAdminLoading,
    error: adminError,
  } = useQuery({
    queryKey: ["name"],
    queryFn: adminDashboard,
  });

  if (isAdminError) {
    return <div>Error: {adminError?.message}</div>;
  }

  const tasks = data?.tasks || [];
  const projects = projectData?.projects || [];

  const projectDetails = projects.map((project) => ({
    estimatedHours: project?.estimated_hours,
    totalHoursSpent: project?.totalHoursSpent,
  }));

  // console.log(projectDetails);
  // for Project
  const CompletedProject = StatusSummaryforProject?.Completed || 0;
  const InprogressProject = StatusSummaryforProject?.["In Progress"] || 0;
  const NotStartedProject = StatusSummaryforProject?.["Not Started"] || 0;
  const PendingProject = StatusSummaryforProject?.Pending || 0;

  const CompletedTask = StatusSummary?.Completed || 0;
  const InprogressTask = StatusSummary?.["In progress"] || 0;
  const NotStartedTask = StatusSummary?.["Not started"] || 0;
  const PendingTask = StatusSummary?.Pending || 0;
  const CancelledTask = StatusSummary?.Cancelled || 0;

  const projectDataForChart = [
    {
      browser: "Completed",
      visitors: CompletedProject,
      color: "#4CAF50",
    },
    {
      browser: "In Progress",
      visitors: InprogressProject,
      color: "#FFC107",
    },
    {
      browser: "Pending",
      visitors: PendingProject,
      color: "#15B097",
    },
    {
      browser: "Not Started",
      visitors: NotStartedProject,
      color: "#F44336",
    },
  ];

  const taskDataForChart = [
    {
      browser: "Completed",
      visitors: CompletedTask,
      color: "#4CAF50",
    },
    {
      browser: "In Progress",
      visitors: InprogressTask,
      color: "#FFC107",
    },
    {
      browser: "Not Started",
      visitors: NotStartedTask,
      color: "#2F195F",
    },
    {
      browser: "Pending",
      visitors: PendingTask,
      color: "#A2C5AC",
    },
    {
      browser: "Cancelled",
      visitors: CancelledTask,
      color: "#F44336",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <header className="bg-gradient-to-r w-full from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-extrabold mb-2 tracking-wide">
          Welcome,{" "}
          <span className="text-yellow-300">
            {isAdminLoading ? "Admin" : adminData?.data?.mail}!
            {/* {adminData?.data.mail || "Admin"}! */}
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
          {isProjectError ? (
            <>{projectError}</>
          ) : isProjectLoading ? (
            <p className="animate-spin fixed">
              <VscLoading />
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
                <MainCards
                  title="Total Projects"
                  totaltasks={projectData?.total}
                  Icon={FaTasks}
                  subtitle="Projects"
                  bgColor="#B23A48"
                />
                <MainCards
                  title="In-progress"
                  btn="View All"
                  totaltasks={InprogressProject}
                  Icon={FaTasks}
                  subtitle="Projects"
                  bgColor="#DCA74B"
                  path="./projects"
                />
                <MainCards
                  title="Completed"
                  btn="View All"
                  totaltasks={CompletedProject}
                  Icon={FaTasks}
                  subtitle="Projects"
                  bgColor="#566E3D"
                  path="./projects"
                />
              </div>
            </>
          )}
          <h1 className="text-lg font-semibold inline-flex items-center gap-10 w-full">
            Tasks{" "}
          </h1>
          {isError ? (
            <>{error}</>
          ) : isLoading ? (
            <p className="animate-spin fixed">
              <VscLoading />
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
                <MainCards
                  title="Total Tasks"
                  totaltasks={data?.total}
                  Icon={FaTasks}
                  subtitle="Task"
                  bgColor="#B23A48"
                />
                <MainCards
                  title="In-progress"
                  btn="View All"
                  totaltasks={InprogressTask}
                  Icon={FaTasks}
                  subtitle="Task"
                  bgColor="#DCA74B"
                  path="./tasks"
                />
                <MainCards
                  title="Completed"
                  btn="View All"
                  totaltasks={CompletedTask}
                  Icon={FaTasks}
                  subtitle="Task"
                  bgColor="#566E3D"
                  path="./tasks"
                />
              </div>
            </>
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

      <RecentProjects projectData={{ projects, projectDetails }} />
    </section>
  );
};

export default Dashboard;
