
const SelectedProjects = () => {
  const selectedProject = JSON.parse(sessionStorage.getItem("selectedProject"));
  console.log(selectedProject);
  const {
    project_name,
    project_description,
    project_ownership,
    milestones = [],
    project_status,
    startDate,
    estimated_hours,
    endDate,
  } = selectedProject;
  console.log(milestones);
  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl font-bold mb-2">{project_name}</h1>
      <p className="text-base mb-5">{project_description}</p>
      <div className="mb-5">
        <h2 className="text-xl mb-2">Ownership</h2>
        <p>Name: {project_ownership.name}</p>
        <p>Email: {project_ownership.mail}</p>
      </div>
      <div className="mb-5">
        <h2 className="text-xl mb-2">Milestones</h2>
        {milestones.map((milestone) => (
          <div key={milestone.id} className="py-1">
            {milestone.title}
          </div>
        ))}
      </div>
      <div>
        <p>Status: {project_status}</p>
        <p>Start Date: {startDate}</p>
        <p>End Date: {endDate}</p>
        <p>Estimated Hours: {estimated_hours}</p>
      </div>
    </div>
  );
};

export default SelectedProjects;
