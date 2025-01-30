// statusUtils.js
export const getStatus = (status) => {
  switch (status) {
    case "Not started":
      return "text-gray-500 bg-gray-50";
    case "Open":
      return "text-gray-500 bg-gray-50";
    case "In progress":
      return "text-blue-500 bg-blue-50";
    case "In Progress":
      return "text-blue-500 bg-blue-50";
    case "Pending":
      return "text-yellow-500 bg-yellow-50";
    case "Resolved":
      return "text-yellow-500 bg-yellow-50";
    case "Closed":
      return "text-green-500 bg-green-50";
    case "Completed":
      return "text-green-500 bg-green-50";
    case "Reopen":
      return "text-orange-500 bg-orange-50";
    case "Cancelled":
      return "text-red-500 bg-red-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
};
