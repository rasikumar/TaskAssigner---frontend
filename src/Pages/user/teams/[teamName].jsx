import { useLocation } from "react-router";
import RoleCard from "@/components/teams/RoleCard";
import { useState } from "react";
import PersonalDetailModal from "@/components/customUi/admin/PersonalDetailModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Teams from "@/hooks/teams/Teams";

const TeamPage = () => {
  // const { teamId } = useParams();

  const location = useLocation();
  const departmentData = location.state?.data;

  const [memberData, setMemberData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  const userTeamsHook = Teams();
  const { userGetPersonDetails } = userTeamsHook;

  if (!departmentData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading team data...</div>
      </div>
    );
  }
  const {
    department = "Unknown Department",
    employeeList = [],
    roleCounts = [],
    totalEmployees,
  } = departmentData;
  // console.log(employeeList);
  const roleColors = {
    manager: "bg-amber-100 border-amber-400",
    member: "bg-rose-100 border-rose-400",
    "team lead": "bg-blue-100 border-blue-400",
    Member: "bg-green-100 border-green-400",
    "HR Manager": "bg-amber-100 border-amber-400",
    "HR Executive": "bg-blue-100 border-blue-400",
    "HR Interns": "bg-rose-100 border-rose-400",
  };

  const handleEmployeeClick = (person) => {
    setIsLoadingDetails(true); // Set loading to true when starting fetch
    setError(null); // Reset any previous errors

    userGetPersonDetails.mutate(person, {
      onSuccess: (data) => {
        setMemberData(data);
        setIsDialogOpen(true);
        setIsLoadingDetails(false);
      },
      onError: (error) => {
        setError(error);
        setIsLoadingDetails(false);
        console.error("Error fetching employee details:", error);
      },
    });
  };

  const filteredEmployees = employeeList.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  return (
    <div className="container mx-auto ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-800">
            {department} Team
          </h1>
          <p className="text-gray-600 mt-2">
            {totalEmployees} {totalEmployees === 1 ? "member" : "members"} in
            this team
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Team Roles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roleCounts.map((role) => {
            const bgColor =
              roleColors[role.role] || "bg-gray-100 border-gray-300";
            return (
              <div key={role.role} className="block">
                <div
                  className={`p-5 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${bgColor}`}
                >
                  <RoleCard role={role} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {employeeList.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Team Members
            </h2>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filteredEmployees.length > 0 ? (
            <div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 text-sm font-medium text-gray-500">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Role</div>
                  <div className="col-span-2">Status</div>
                </div>

                {paginatedEmployees.map((employee) => (
                  <div key={employee._id}>
                    <div
                      className="grid grid-cols-12 items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleEmployeeClick(employee._id)}
                    >
                      <div className="col-span-1 text-sm text-gray-500 font-mono">
                        #{employee.employee_id}
                      </div>
                      <div className="col-span-4 flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {employee.mail || "No email"}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {employee.role}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div>
                  Showing {paginatedEmployees.length} of{" "}
                  {filteredEmployees.length} members
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-6">
              No members found matching &apos;{searchQuery}&apos;
            </div>
          )}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <PersonalDetailModal
            details={memberData}
            isLoading={isLoadingDetails}
            error={error}
          />
        </DialogContent>
      </Dialog>
      {/* <PersonalDetailModal details={memberData} /> */}
    </div>
  );
};

export default TeamPage;
