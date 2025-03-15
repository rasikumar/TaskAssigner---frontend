import { FaTasks } from "react-icons/fa";
// import SummaryCard from "@/components/ProjectSummaryChart";
import MainCards from "@/components/ui/cards/MainCards";
import RoleChecker from "@/lib/RoleChecker";
import UserDashBoardHook from "@/hooks/UserDashBoardHook";
import { VscLoading } from "react-icons/vsc";
import { RecentTask } from "./RecentTask";
import SummaryCard from "@/components/ProjectSummaryChart";
import { RecentProjects } from "./RecentProjects";

const UserDashboard = () => {
  const getName = localStorage.getItem("name");
  const name = getName ? getName.replace(/^"|"$/g, "") : "Loading...";
  const getRole = localStorage.getItem("role");
  const role = getRole ? getRole.replace(/^"|"$/g, "") : "Loading...";

  const {
    userTaskData,
    isUserTaskDataError,
    userTaskDataError,
    isUserTaskDataLoading,
    userProjectData,
    userProjectDataError,
    isUserProjectDataError,
    isUserProjectDataLoading,
  } = UserDashBoardHook();

  // const CompletedTask = StatusSummary?.Completed || 0;
  // const InprogressTask = StatusSummary?.["In progress"] || 0;
  // const NotStartedTask = StatusSummary?.["Not started"] || 0;
  // const PendingTask = StatusSummary?.Pending || 0;
  // const CancelledTask = StatusSummary?.Cancelled || 0;

  // const taskDataForChart = [
  //   {
  //     browser: "Completed",
  //     visitors: CompletedTask,
  //     color: "#4CAF50",
  //   },
  //   {
  //     browser: "In Progress",
  //     visitors: InprogressTask,
  //     color: "#FFC107",
  //   },
  //   {
  //     browser: "Not Started",
  //     visitors: NotStartedTask,
  //     color: "#2F195F",
  //   },
  //   {
  //     browser: "Pending",
  //     visitors: PendingTask,
  //     color: "#A2C5AC",
  //   },
  //   {
  //     browser: "Cancelled",
  //     visitors: CancelledTask,
  //     color: "#F44336",
  //   },
  // ];

  const projectData = userProjectData?.data?.statusSummary || {}; // Ensure it's always an object

  const projectss = userProjectData?.data?.projects || [];

  const projectDetails = projectss.map((project) => ({
    estimatedHours: project?.estimated_hours,
    totalHoursSpent: project?.totalHoursSpent,
  }));
  console.log(projectDetails);

  const CompletedProject = projectData?.Completed || 0;
  const InprogressProject = projectData?.["In Progress"] || 0;
  const NotStartedProject = projectData?.["Not Started"] || 0;
  const PendingProject = projectData?.Pending || 0;

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

  // console.log(userProjectData.data?.statusSummary);

  const userRole = role || "guest";

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
              {isUserProjectDataError ? (
                <>{userProjectDataError}</>
              ) : isUserProjectDataLoading ? (
                <p className="animate-spin fixed">
                  <VscLoading />
                </p>
              ) : (
                <>
                  <MainCards
                    title="Yet to Start"
                    btn="View All"
                    totaltasks={projectData?.["Not Started"] || []}
                    Icon={FaTasks}
                    subtitle="Projects"
                    bgColor="#B23A48"
                    path="./projects"
                  />
                  <MainCards
                    title="In-progress"
                    btn="View All"
                    totaltasks={projectData?.["In Progress"] || []}
                    Icon={FaTasks}
                    subtitle="Projects"
                    bgColor="#DCA74B"
                    path="./projects"
                  />
                  <MainCards
                    title="Completed"
                    btn="View All"
                    totaltasks={projectData?.Completed || []}
                    Icon={FaTasks}
                    subtitle="Projects"
                    bgColor="#566E3D"
                    path="./projects"
                  />
                </>
              )}
            </div>
          </RoleChecker>

          <h1 className="text-lg font-semibold">Tasks</h1>
          <div className="grid grid-cols-1 2xl:grid-cols-3 xl:grid-cols-2 gap-4">
            {isUserTaskDataError ? (
              <>{userTaskDataError}</>
            ) : isUserTaskDataLoading ? (
              <p className="animate-spin fixed">
                <VscLoading />
              </p>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
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
        {/* <RecentTask taskData={recent || []} /> */}
      </RoleChecker>

      {userRole !== "member" && (
        <RoleChecker allowedRoles={["manager", "team lead"]}>
          <RecentProjects projectData={{ projectss, projectDetails }} />
        </RoleChecker>
      )}
    </section>
  );
};

export default UserDashboard;
