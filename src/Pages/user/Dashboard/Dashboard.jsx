// import { fetchFullDashBoard } from "@/API/user/dashboard/dashboard";
import SummaryCard from "@/components/ProjectSummaryChart";
import MainCards from "@/components/ui/cards/MainCards";
// import { useQuery } from "@tanstack/react-query";
import { FaTasks } from "react-icons/fa";
// import { CirclesWithBar } from "react-loader-spinner";
import { RecentProjects } from "./RecentProjects";
import RoleChecker from "@/hooks/RoleChecker";
import { RecentTask } from "./RecentTask";

const UserDashboard = () => {
  // const { isLoading, data, isError, error } = useQuery({
  //   queryKey: ["dashboard"],
  //   queryFn: () => {
  //     return fetchFullDashBoard();
  //   },
  // });
  // const dashboard = data || {};

  // const completedTasks = dashboard.completedTasks || [];
  // const inProgressTasks = dashboard.inProgressTasks || [];
  // const pendingTasks = dashboard.pendingTasks || [];
  // const allTasks = dashboard.result || [];
  const getName = localStorage.getItem("name");
  const name = getName ? getName.replace(/^"|"$/g, "") : "Loading...";

  return (
    <section className="flex flex-col gap-6">
      <header className="bg-gradient-to-r w-full from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-extrabold mb-2 tracking-wide">
          Welcome, <span className="text-yellow-300">{name || "Admin"}!</span>
        </h1>
        <p className="text-base font-medium">
          We&apos;re glad to see you back. 🚀 Here&apos;s a quick overview of
          your tasks:
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Column */}
        <div className="flex flex-col gap-6">
          <h1 className="text-lg font-semibold">Projects</h1>
          {/* {projects.length === 0 ? (
            <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-lg shadow">
              <p className="text-gray-500 text-lg font-medium">
                No tasks available
              </p>
            </div>
          ) : ( */}
          <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
            <MainCards
              title="Yet to Start"
              btn="View All"
              totaltasks={[]}
              Icon={FaTasks}
              subtitle="Projects"
              bgColor="#B23A48"
              path="./projects"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={[]}
              Icon={FaTasks}
              subtitle="Projects"
              bgColor="#DCA74B"
              path="./projects"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={[]}
              Icon={FaTasks}
              subtitle="Projects"
              bgColor="#566E3D"
              path="./projects"
            />
          </div>
          {/* )} */}

          <h1 className="text-lg font-semibold">Tasks</h1>
          {/* {tasks.length === 0 ? (
            <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-lg shadow">
              <p className="text-gray-500 text-lg font-medium">
                No tasks available
              </p>
            </div>
          ) : ( */}
          <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
            <MainCards
              title="Yet to Start"
              btn="View All"
              totaltasks={[]}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#B23A48"
              path="./tasks"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={[]}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#DCA74B"
              path="./tasks"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={[]}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#566E3D"
              path="./tasks"
            />
          </div>
          {/* )} */}
        </div>

        {/* Second Column */}
        <div className="grid 2xl:grid-cols-2 gap-4">
          <SummaryCard
            title="Project Status"
            description="Project Completion Overview"
            // chartData={projectDataForChart}
            chartConfig={{
              Completed: { label: "Completed", color: "#4CAF50" },
              "In Progress": { label: "In Progress", color: "#FFC107" },
              "Not Started": { label: "Not Started", color: "#F44336" },
            }}
          />
          <SummaryCard
            title="Task Status"
            description="Task Completion Overview"
            // chartData={taskDataForChart}
            chartConfig={{
              Completed: { label: "Completed", color: "#4CAF50" },
              "In Progress": { label: "In Progress", color: "#FFC107" },
              "Not Started": { label: "Not Started", color: "#F44336" },
            }}
          />
        </div>
      </section>
      <RoleChecker allowedRoles={["member"]}>
        <RecentTask taskData={[]} />
      </RoleChecker>

      <RoleChecker allowedRoles={["manager", "team lead"]}>
        <RecentProjects projectData={[]} />
      </RoleChecker>
    </section>
  );
};

export default UserDashboard;
