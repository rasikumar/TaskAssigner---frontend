/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaPen, FaRegWindowClose } from "react-icons/fa";
import { Input } from "../input";
import { Button } from "../button";

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
      console.log(formData);
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
        className={`bg-white absolute right-4 bottom-4 w-[30rem] h-[85%] p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white h-14 flex items-center justify-between px-6 rounded-t-xl">
          <h1 className="text-xl font-semibold">Project Overview</h1>
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
        <div className="mt-6">
          {isEditing ? (
            <>
              {renderInput(
                "project_name",
                "Project Name",
                formData.project_name
              )}
              {renderInput(
                "project_status",
                "Project Status",
                formData.project_status
              )}
              {renderInput(
                "project_description",
                "Project Description",
                formData.project_description
              )}
              {renderInput(
                "estimated_hours",
                "Estimated Hours",
                formData.estimated_hours
              )}
              <Button onClick={handleSave}>Update Project</Button>
            </>
          ) : (
            <>
              <p className="text-lg">{project.project_name}</p>
              <p>{project.project_status}</p>
              <p>{project.project_description}</p>
              <p>{project.estimated_hours} hours</p>
            </>
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
