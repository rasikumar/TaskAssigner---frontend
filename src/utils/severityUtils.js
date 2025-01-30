export const getSeverity = (status) => {
  switch (status) {
    case "Minor":
      return "text-blue-500 bg-blue-50";
    case "Major":
      return "text-orange-500 bg-orange-50";
    case "Critical":
      return "text-red-500 bg-red-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
};
