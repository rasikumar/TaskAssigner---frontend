import { useParams, Link } from "react-router";
import { teams } from "@/data/teams"; // Assuming your data is coming from this location

const MemberDetailPage = () => {
  const { teamName, roleName, memberId } = useParams();

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

  // Find the member by their ID
  const member = role.members.find((m) => m.id === memberId);
  console.log(role);
  
  // If the member doesn't exist, show an error
  if (!member) return <p>Member not found</p>;

  return (
    <div className="bg-slate-300 rounded-xl p-8">
      <Link
        to={`/team/${teamName}/role/${roleName}`}
        className="text-blue-500 hover:underline"
      >
        Back to {role.name} Role
      </Link>
      <h1 className="text-white text-3xl mt-4 mb-8">
        {member.name}&apos;s Profile
      </h1>
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={member.profile}
          alt={`${member.name}'s profile`}
          className="w-32 h-32 rounded-full border-2 border-white"
        />
        <div>
          <h2 className="text-white text-xl">{member.name}</h2>
          <p className="text-white text-sm">{member.email}</p>
          <p className="text-white text-sm">{member.phone}</p>
        </div>
      </div>
      <div>
        <h3 className="text-white text-2xl mb-4">Biography</h3>
        <p className="text-white">{member.bio}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-white text-2xl mb-4">Tasks Assigned</h3>
        <ul className="space-y-4">
          {Array.isArray(member.tasks) && member.tasks.length > 0 ? (
            member.tasks.map((task) => (
              <li key={task.id} className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between">
                  <span className="font-medium">{task.title}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No tasks assigned.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MemberDetailPage;
