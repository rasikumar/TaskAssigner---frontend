import { fetchAllUserProjects } from "@/API/user/projects/project";
import Table from "@/components/customUi/Table";
import { UserProjectDetailModal } from "@/components/customUi/user/UserProjectDetailModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const UserProjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const {
    isLoading: isUserProjectsLoading,
    error: userProjectsError,
    isError: isUserProjectsError,
    data: userProjectsData,
  } = useQuery({
    queryKey: ["userProjects"],
    queryFn: fetchAllUserProjects,
  });
  const projectData = userProjectsData?.data;
  // console.log(projectData);

  if (isUserProjectsLoading) return <div>Loading...</div>;
  if (isUserProjectsError) return <div>Error: {userProjectsError.message}</div>;

  const column = [
    { key: "project_title", title: "Project Title" },
    {
      key: "project_ownership",
      title: "Project Ownership",
      className: "text-center",
    },
    { key: "estimated_hours", title: "Total Hours", className: "text-center" },
    { key: "start_date", title: "Start Date" },
    { key: "end_date", title: "End Date" },
    { key: "status", title: "Status" },
    { key: "action", title: "Action", className: "text-center" },
  ];

  const renderRow = (project) => (
    <>
      <td
        onClick={() => {
          handleProjectClick(project); // Pass projectId here
        }}
        className="px-2 py-3 text-sm text-primary font-bold "
      >
        {project.project_name}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {project.project_ownership.name || "No name available"}
      </td>
      <td className="px-2 py-3 text-sm text-center">
        {project.estimated_hours}
      </td>
      <td className="px-2 py-3 text-sm">
        {new Date(project.startDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </td>
      <td className="px-2 py-3 text-sm">
        {new Date(project.endDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </td>
      <td className="px-2 py-3 text-sm">{project.project_status}</td>
      <td className="px-2 py-3 text-sm text-center">
        {/* <DeleteDialog
          message="Are you sure you want to delete this project?"
          onConfirm={() => handleDeleteProject(project._id)}
          isLoading={deleteMutation.isPending}
        /> */}
      </td>
    </>
  );

  return (
    <div>
      <Table
        columns={column}
        renderRow={renderRow}
        data={projectData?.projects}
      />
      {isModalOpen && (
        <UserProjectDetailModal
          project={selectedProject}
          onClose={() => setIsModalOpen(false)}
          // onEdit={handleUpdateProject}
        />
      )}
    </div>
  );
};

export default UserProjects;
