// statusUtils.js
export const getStatus = (status) => {
  switch (status) {
    case "Not Started":
      return "text-gray-500";
    case "In Progress":
      return "text-blue-500";
    case "Pending":
      return "text-yellow-500";
    case "Completed":
      return "text-green-500";
    case "Cancelled":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
