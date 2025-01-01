/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaPen, FaRegWindowClose } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const ProjectDetailModal = ({ project, onClose, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(project);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setFormData(project);
  }, [project]);

  console.log(formData);
  if (!project) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (JSON.stringify(formData) === JSON.stringify(project)) {
      setErrorMessage("No changes were made.");
    } else {
      setErrorMessage(""); // Clear error message
      onEdit(formData); // Submit changes if there are any
    }
  };

  const renderInput = (name, label, value) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <Input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full p-2 border-b-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white absolute right-4 bottom-4 2xl:w-[30rem] w-[25rem] h-[85%] rounded-sm shadow-lg transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-gradient-to-r from-taskBlack to-bg text-white h-14 flex items-center justify-between px-6 rounded-t-sm">
          <h1 className="2xl:text-xl text-sm font-semibold">
            Project Overview
          </h1>
          <div className="flex gap-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FaPen size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaRegWindowClose size={20} />
            </button>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="mt-6 h-96 px-4 overflow-scroll">
          {isEditing ? (
            <>
              {renderInput(
                "project_name",
                "Project Name",
                formData.project_name
              )}
              {renderInput(
                "project_description",
                "Project Description",
                formData.project_description
              )}
              {renderInput(
                "project_status",
                "Project Status",
                formData.project_status
              )}
              {renderInput(
                "estimated_hours",
                "Estimated Hours",
                formData.estimated_hours
              )}
              {renderInput("endDate", "End Date", formData.endDate)}
              <Button onClick={handleSave}>Update Project</Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <h1 className="text-taskBlack text-lg font-semibold">
                {project.project_name}
              </h1>
              <hr className="bg-taskBlack h-[0.1rem] border-0" />
              <p className="text-taskBlack text-sm ">
                {project.project_description}
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm text-taskBlack inline-flex items-center justify-between">
                  Status{" "}
                  <span
                    className={`${
                      project.project_status === "Not Started"
                        ? "bg-emerald-400 px-2 py-1 rounded-full"
                        : project.project_status === "In Progress"
                        ? "bg-red-500 px-2 py-1 rounded-full"
                        : project.project_status === "Pending"
                        ? "bg-blue-400 px-2 py-1 rounded-full"
                        : project.project_status === "Completed"
                        ? "bg-slate-500 px-2 py-1 rounded-full"
                        : "bg-white px-2 py-1 rounded-full"
                    } text-black md:text-xs 2xl:text-sm`}
                  >
                    {project.project_status}
                  </span>
                </p>
                <p className="text-sm text-taskBlack inline-flex items-center justify-between">
                  Estimated Hours{" "}
                  <span className="text-black">
                    {project.estimated_hours} hours
                  </span>
                </p>
                <p className="text-sm text-taskBlack inline-flex items-center justify-between">
                  Due Date{" "}
                  <span className="text-black">
                    {new Date(project.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-taskBlack">
                    Tasks
                  </h2>
                  <ul className="mt-2 space-y-2">
                    <li className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                      <span className="text-sm">Task 1: Design Wireframe</span>
                      <span className="text-xs text-gray-500">In Progress</span>
                    </li>
                    <li className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                      <span className="text-sm">Task 2: Development</span>
                      <span className="text-xs text-gray-500">Not Started</span>
                    </li>
                    <li className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                      <span className="text-sm">Task 3: Testing</span>
                      <span className="text-xs text-gray-500">Pending</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 text-red-500 text-sm text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};
