/* eslint-disable react/prop-types */

export const UserCard = ({
  name,
  role,
  number,
  viewbtn,
  mail,
  startDate,
  endDate,
}) => {
  return (
    <div className="rounded-lg p-6 w-64">
      <div className="flex items-center mb-4">
        <div>
          <h3 className="text-2xl font-bold text-blue-800">{name}</h3>
          <p className="text-blue-600">{role}</p>
        </div>
      </div>

      <p className="text-gray-800 mb-2">
        <strong>Start Date:</strong> {startDate}
      </p>
      <p className="text-gray-800 mb-2">
        <strong>End Date:</strong> {endDate}
      </p>
      <p className="text-gray-800 mb-2">
        <strong>Phone:</strong> {number}
      </p>
      <p className="text-gray-800 mb-4">
        <strong>Email:</strong> {mail}
      </p>
      {viewbtn && (
        <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700">
          View
        </button>
      )}
    </div>
  );
};
