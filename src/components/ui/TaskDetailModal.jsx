import { FaRegWindowClose } from "react-icons/fa";
import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
export const TaskDetailsModal = ({ task, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!task) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white absolute right-4 bottom-4 h-[82%] p-6 rounded-lg shadow-lg w-[30rem] transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaRegWindowClose size={24} />
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-primary">
          {task.project_title}
        </h2>
        <div className="space-y-2">
          <p className="text-gray-700">
            Priority: <span className="font-medium">{task.priority}</span>
          </p>
          <p className="text-gray-700">
            Time Line:{" "}
            <span className="font-medium">
              {task.start_date} - {task.end_date}
            </span>
          </p>
          <p className="text-gray-700">
            Status: <span className="font-medium">{task.status}</span>
          </p>
          <p className="text-gray-700">
            Report To:{" "}
            <span className="font-medium">{task.report_to.name}</span>
          </p>
          <p className="text-gray-700">
            Description:{" "}
            <span className="font-medium">{task.project_description}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
