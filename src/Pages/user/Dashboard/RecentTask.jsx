/* eslint-disable react/prop-types */
import { TasksCard } from "@/components/ui/cards/TasksCard";
import { Link } from "react-router";

export const RecentTask = ({ taskData = [] }) => {
  const recentTasks = taskData.slice(-4); // Get the last four projects
  return (
    <div>
      <section className="bg-gray-400 py-8 w-full mx-auto rounded-xl px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl text-white font-semibold mb-2">
            Recent Tasks
          </h1>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* View All Link */}
        {recentTasks.length < 0 && (
          <div className="text-center mb-6">
            <Link
              to="./tasks"
              className="text-white bg-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-500 transition duration-300"
            >
              View All Tasks
            </Link>
          </div>
        )}
        {/* Projects Grid */}
        {recentTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentTasks.map((project) => (
              <div key={project.id} className=" transition duration-300">
                <TasksCard
                  title={project.project_name}
                  subtitle={project.project_description}
                  priority={project.project_status}
                  progressBar={21}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white">
            No recent Tasks available.
          </div>
        )}
      </section>
    </div>
  );
};
