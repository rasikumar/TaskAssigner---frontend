import RoleCard from "@/components/teams/RoleCard";
import { teams } from "@/data/teams";
import { Link } from "react-router";
import { useParams } from "react-router";

const TeamPage = () => {
  const { teamName } = useParams(); // Get teamName from the URL params

  const team = teams.find(
    (t) => t.name.toLowerCase().replace(/\s+/g, "-") === teamName
  );

  // console.log(teams);

  // Static color mapping for roles
  const roleColors = {
    Manager: "bg-[#DCA74B]",
    Interns: "bg-[#B23A48]",
    "Team Leader": "bg-[#004E89]",
    Members: "bg-[#566e3d]",
    "HR Manager": "bg-[#DCA74B]",
    "HR Executive": "bg-[#004E89]",
    "HR Interns": "bg-[#B23A48]",
  };

  if (!team) return <p>Team not found</p>;

  return (
    <div className="bg-bg shadow-shadow-p rounded-xl p-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-pr font-bold text-3xl mb-4">
            {team.name} Team
          </h1>
          <p className="text-pr mb-8">{team.description}</p>
        </div>
        <div className="flex items-center">
          <p className="text-white mb-8 ">{team.totalTasksFinished}</p>
          <p className="text-white mb-8">{team.totalTasksPending}</p>
        </div>
      </div>
      <h2 className="text-pr font-semibold text-2xl mb-4">Roles</h2>
      <ul className="flex gap-4">
        {team.roles.map((role) => {
          // Get the color for the role or use a default
          const bgColor = roleColors[role.name] || "bg-gray-200";
          return (
            <li
              key={role.name}
              className={`flex gap-4 flex-col 2xl:w-full sm:w-[45%] md:w-[30%] p-4 ${bgColor} shadow-minimal border-l-8 border-pink-300 rounded-lg`}
            >
              <Link
                to={`./${role.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-black flex flex-col gap-4"
              >
                <div>
                  <RoleCard role={role} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TeamPage;
