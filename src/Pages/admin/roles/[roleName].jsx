import { useParams, Link, useNavigate } from "react-router";
import { teams } from "@/data/teams";

const RolePage = () => {
  const { teamName, roleName } = useParams();
  const navigate = useNavigate();

  // Find the team by its name
  const team = teams.find(
    (t) => t.name.toLowerCase().replace(/\s+/g, "-") === teamName
  );

  // If the team doesn't exist, show an error
  if (!team) return <p>Team not found</p>;

  // Find the role within the team
  const role = team.roles.find(
    (r) => r.name.toLowerCase().replace(/\s+/g, "-") === roleName
  );

  // If the role doesn't exist, show an error
  if (!role) return <p>Role not found</p>;

  const handleProfileClick = (memberName) => {
    // Navigate to the profile page of the member
    navigate(`./${memberName.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="rounded-xl ">
      <h1 className="text-white text-3xl mb-4">
        {role.name} Role in {team.name} Team
      </h1>
      <p className="text-white mb-8">{role.tasksDetails}</p>
      <ul className="space-y-6">
        {Array.isArray(role.members) && role.members.length > 0 ? (
          role.members.map((member) => (
            <li
              key={member.name}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProfileClick(member.id)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={member.profile}
                  alt={`${member.name}'s profile`}
                  className="w-12 h-12 rounded-full border"
                />
                <div>
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm italic">
            No members available for this role.
          </p>
        )}
      </ul>
      <div>
        <h2 className="text-white text-2xl">Tasks Overview</h2>
        <p className="text-white">Tasks Finished: {role.tasksFinished}</p>
        <p className="text-white">Tasks Pending: {role.tasksPending}</p>
      </div>

      {/* Navigation to team page */}
      <Link
        to={`./team/${teamName.toLowerCase().replace(/\s+/g, "-")}`}
        className="mt-4 inline-block text-blue-500 hover:text-blue-700"
      >
        Back to {team.name} Team
      </Link>
    </div>
  );
};

export default RolePage;
