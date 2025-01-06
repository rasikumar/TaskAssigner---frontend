import { adminDashboard } from "@/API/admin/adminDashborad";
import { fetchAllProjects } from "@/API/admin/projects/project_api";
import { fetchAllTasks } from "@/API/admin/task/task_api";
import MotionSection from "@/components/MotionSection";
import ProjectSummaryChart from "@/components/ProjectSummaryChart";
// import MotionSection from "@/components/MotionSection";
import MainCards from "@/components/ui/cards/MainCards";
import { ProjectsCard } from "@/components/ui/cards/ProjectsCard";
import { useQuery } from "@tanstack/react-query";

import { FaTasks } from "react-icons/fa";
import { CirclesWithBar } from "react-loader-spinner";

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

  if (isAdminLoading || isLoading || isProjectLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
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

  const CompletedProject = projects.filter(
    (project) => project.project_status === "Completed"
  );
  const InprogressProject = projects.filter(
    (project) => project.project_status === "Pending"
  );
  const NotStartedProject = projects.filter(
    (project) => project.project_status === "Not Started"
  );

  const CompletedTask =
    tasks.length > 0 ? tasks.filter((task) => task.status === "Completed") : [];
  const InprogressTask =
    tasks.length > 0
      ? tasks.filter((task) => task.status === "In progress")
      : [];
  const NotStartedTask =
    tasks.length > 0
      ? tasks.filter((task) => task.status === "Not started")
      : [];

  const projectDataForChart = [
    { name: "Completed", value: CompletedProject.length },
    { name: "In Progress", value: InprogressProject.length },
    { name: "Not Started", value: NotStartedProject.length },
  ];

  const TaskDataForChart = [
    { name: "Completed", value: CompletedTask.length },
    { name: "In Progress", value: InprogressTask.length },
    { name: "Not Started", value: NotStartedTask.length },
  ];
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
              subtitle="Projects"
              bgColor="#B23A48"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={InprogressProject.length} // Fix task count
              Icon={FaTasks}
              subtitle="Projects"
              bgColor="#DCA74B"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={CompletedProject.length} // Fix task count
              Icon={FaTasks}
              subtitle="Projects"
              bgColor="#566E3D"
            />
          </div>

          {/* Tasks Section */}
          <h1 className="text-lg font-semibold my-4">Tasks</h1>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-lg shadow">
              <p className="text-gray-500 text-lg font-medium">
                No tasks available
              </p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Second Column */}
        <div className="grid grid-cols-1 mt-[3.7rem] bg-[#f9a065] rounded-xl h-[21.3rem] w-full gap-4">
          {/* Today's Tasks Section */}
          <div className="flex items-center justify-center mt-5">
            <div>
              <MotionSection>
                <h1 className="text-white mt-6 text-lg font-medium z-50 text-center">
                  Project Summary
                </h1>
              </MotionSection>
              <div className="-mt-20">
                <ProjectSummaryChart data={projectDataForChart} />
              </div>
            </div>
            <div>
              <MotionSection>
                <h1 className="text-white mt-6 text-lg font-medium z-50 text-center">
                  Task Summary
                </h1>
              </MotionSection>
              <div className="-mt-20">
                <ProjectSummaryChart data={TaskDataForChart} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-taskBlack py-6 w-full mx-auto rounded-xl px-4">
        <h1 className="text-2xl text-white text-center font-semibold p-4">
          Recent Projects
        </h1>
        <div className="flex gap-x-4 items-center justify-between w-full p-4">
          <ProjectsCard
            title="Project Alpha"
            subtitle="Building a dashboard UI"
            priority="High"
            progressBar={45}
          />
          <ProjectsCard
            title="Project Alpha"
            subtitle="Building a dashboard UI"
            priority="High"
            progressBar={45}
          />
          <ProjectsCard
            title="Project Alpha"
            subtitle="Building a dashboard UI"
            priority="High"
            progressBar={45}
          />
          <ProjectsCard
            title="Project Alpha"
            subtitle="Building a dashboard UI"
            priority="High"
            progressBar={45}
          />
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
