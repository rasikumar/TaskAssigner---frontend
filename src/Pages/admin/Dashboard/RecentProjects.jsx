/* eslint-disable react/prop-types */
import { getProjectById } from "@/API/admin/projects/project_api";
import { ProjectsCard } from "@/components/ui/cards/ProjectsCard";
import { Link } from "react-router"; // Make sure to import from 'react-router-dom'

export const RecentProjects = ({ projectData }) => {
  // Save project data in session storage

  const { projects, projectDetails } = projectData;

  // Add percentage calculation to projectDetails
  const projectDetailsWithPercentage = projectDetails.map((project) => {
    const percentage = project.estimatedHours
      ? ((project.totalHoursSpent / project.estimatedHours) * 100).toFixed(2)
      : 0; // Handle division by zero

    return { ...project, percentage };
  });

  // Get the last four projects
  const recentProjects = projects.slice(-4);

  return (
    <section className="bg-gray-400 flex flex-col py-8 mx-auto rounded-xl px-6 w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl text-white font-semibold mb-2">
          Recent Projects
        </h1>
        <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>

      {/* View All Link */}
      <div className="text-center mb-6">
        <Link
          to="./projects"
          className="text-white bg-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-500 transition duration-300"
        >
          View All Projects
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="flex flex-wrap items-center justify-center w-full m-auto gap-6">
        {recentProjects.map((project, index) => {
          const percentage =
            projectDetailsWithPercentage[index]?.percentage || 0;

          return (
            <div key={project._id} className="flex transition duration-300">
              <Link
                to={`./projects/${project._id}`}
                onClick={() => getProjectById(project._id)}
                className="flex"
              >
                <ProjectsCard
                  title={project.project_name}
                  subtitle={project.project_description}
                  priority={project.project_status}
                  progressBar={percentage} // Pass percentage to progressBar
                />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};
