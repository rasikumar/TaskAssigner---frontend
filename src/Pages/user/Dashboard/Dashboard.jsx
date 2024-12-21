import { fetchFullDashBoard } from "@/API/user/dashboard/dashboard";
import MainCards from "@/components/ui/cards/MainCards";
import { useQuery } from "@tanstack/react-query";
import { FaTasks } from "react-icons/fa";
import { CirclesWithBar } from "react-loader-spinner";

const UserDashboard = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => {
      return fetchFullDashBoard();
    },
  });
  const dashboard = data || {};

  const completedTasks = dashboard.completedTasks || [];
  const inProgressTasks = dashboard.inProgressTasks || [];
  const pendingTasks = dashboard.pendingTasks || [];
  // const allTasks = dashboard.result || [];

  return (
    <div>
      {isError ? (
        <>{`Loading:${error}`}</>
      ) : (
        <>
          {isLoading ? (
            <>
              <div className="flex items-center justify-center w-full h-full">
                <CirclesWithBar
                  color="#4fa94d"
                  outerCircleColor="#4fa94d"
                  innerCircleColor="#4fa94d"
                  barColor="#4fa94d"
                  visible={true}
                />
              </div>
            </>
          ) : (
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
                      totaltasks={pendingTasks.length}
                      Icon={FaTasks}
                      subtitle="Task"
                      bgColor="#B23A48"
                    />
                    <MainCards
                      title="In-progress"
                      btn="View All"
                      totaltasks={inProgressTasks.length}
                      Icon={FaTasks}
                      subtitle="Task"
                      bgColor="#DCA74B"
                    />
                    <MainCards
                      title="Completed"
                      btn="View All"
                      totaltasks={completedTasks.length}
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
          )}
        </>
      )}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"></header>
    </div>
  );
};

export default UserDashboard;
