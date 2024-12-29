/* eslint-disable react/prop-types */

export const UserCard = ({
  name = "N/A",
  role = "N/A",
  number = "N/A",
  viewbtn = false,
  mail = "N/A",
  startDate = "N/A",
  endDate = "N/A",
  actionButton = null,
}) => {
  return (
    <div className="rounded-lg p-6 w-64 border border-gray-300 shadow-md">
      <div className="flex items-center mb-4">
        <div>
          <h3 className="text-2xl font-bold text-blue-800">{name}</h3>
          <p className="text-blue-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-800 mb-2">
        <strong>Start Date:</strong> {startDate || "N/A"}
      </p>
      <p className="text-gray-800 mb-2">
        <strong>End Date:</strong> {endDate || "N/A"}
      </p>
      <p className="text-gray-800 mb-2">
        <strong>Phone:</strong> {number || "N/A"}
      </p>
      <p className="text-gray-800 mb-4">
        <strong>Email:</strong> {mail || "N/A"}
      </p>
      {viewbtn && (
        <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700">
          View
        </button>
      )}
      {actionButton}
    </div>
  );
};
