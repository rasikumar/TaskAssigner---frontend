/* eslint-disable react/prop-types */
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export const ProjectsCard = ({ title, subtitle, priority, progressBar }) => {
  // Dynamic progress bar color based on progress percentage
  const getProgressColor = () => {
    if (progressBar < 30) return "bg-red-500"; // Low progress
    if (progressBar < 70) return "bg-yellow-500"; // Medium progress
    return "bg-green-500"; // High progress
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg w-80 hover:shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-gray-300">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white flex items-center gap-1">
            {priority === "High" ? (
              <FaExclamationCircle className="text-red-500" />
            ) : (
              <FaCheckCircle className="text-green-500" />
            )}
            {priority}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <span className="text-sm text-gray-200">Progress</span>
          <span className="text-sm font-semibold text-gray-200">
            {progressBar}%
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }} // Initial state: 0% width
            animate={{ width: `${progressBar}%` }} // Animate to the provided percentage
            transition={{ duration: 1.5, ease: "easeInOut" }} // Smooth transition
            className={`h-2.5 rounded-full ${getProgressColor()}`}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};
