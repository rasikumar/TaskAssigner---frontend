import { FaTasks } from "react-icons/fa";
import SummaryCard from "@/components/ProjectSummaryChart";
import MainCards from "@/components/ui/cards/MainCards";
import RoleChecker from "@/lib/RoleChecker";
import { RecentProjects } from "./RecentProjects";
import { RecentTask } from "./RecentTask";
import UserDashBoardHook from "@/hooks/UserDashBoardHook"; // Import the hook
import { CirclesWithBar } from "react-loader-spinner"; // For loading indicator

const UserDashboard = () => {
  const {
    userTaskData,
    isUserTaskDataLoading,
    isUserTaskDataError,
    userTaskDataError,
  } = UserDashBoardHook();

  console.log(userTaskData);

  const getName = localStorage.getItem("name");
  const name = getName ? getName.replace(/^"|"$/g, "") : "Loading...";

  if (isUserTaskDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CirclesWithBar color="#4CAF50" height={80} width={80} />
      </div>
    );
  }

  if (isUserTaskDataError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {userTaskDataError?.message || "Failed to fetch data"}</p>
      </div>
    );
  }

  const { projects, tasks } = userTaskData || {};

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
          <RoleChecker allowedRoles={["manager", "team lead"]}>
            <h1 className="text-lg font-semibold">Projects</h1>
            <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
              <MainCards
                title="Yet to Start"
                btn="View All"
                totaltasks={projects?.notStarted || []}
                Icon={FaTasks}
                subtitle="Projects"
                bgColor="#B23A48"
                path="./projects"
              />
              <MainCards
                title="In-progress"
                btn="View All"
                totaltasks={projects?.inProgress || []}
                Icon={FaTasks}
                subtitle="Projects"
                bgColor="#DCA74B"
                path="./projects"
              />
              <MainCards
                title="Completed"
                btn="View All"
                totaltasks={projects?.completed || []}
                Icon={FaTasks}
                subtitle="Projects"
                bgColor="#566E3D"
                path="./projects"
              />
            </div>
          </RoleChecker>

          <h1 className="text-lg font-semibold">Tasks</h1>
          <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
            <MainCards
              title="Yet to Start"
              btn="View All"
              totaltasks={tasks?.notStarted || []}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#B23A48"
              path="./tasks"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={tasks?.inProgress || []}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#DCA74B"
              path="./tasks"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={tasks?.completed || []}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#566E3D"
              path="./tasks"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="grid 2xl:grid-cols-2 gap-4">
          <RoleChecker allowedRoles={["manager", "team lead"]}>
            <SummaryCard
              title="Project Status"
              description="Project Completion Overview"
              chartData={projects} // Use data from hook
              chartConfig={{
                Completed: { label: "Completed", color: "#4CAF50" },
                "In Progress": { label: "In Progress", color: "#FFC107" },
                "Not Started": { label: "Not Started", color: "#F44336" },
              }}
            />
          </RoleChecker>
          <SummaryCard
            title="Task Status"
            description="Task Completion Overview"
            chartData={tasks} // Use data from hook
            chartConfig={{
              Completed: { label: "Completed", color: "#4CAF50" },
              "In Progress": { label: "In Progress", color: "#FFC107" },
              "Not Started": { label: "Not Started", color: "#F44336" },
            }}
          />
        </div>
      </section>

      <RoleChecker allowedRoles={["member"]}>
        <RecentTask taskData={tasks?.recent || []} />
      </RoleChecker>

      <RoleChecker allowedRoles={["manager", "team lead"]}>
        <RecentProjects projectData={projects?.recent || []} />
      </RoleChecker>
    </section>
  );
};

export default UserDashboard;
