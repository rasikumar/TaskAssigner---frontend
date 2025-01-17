import { FaPen, FaRedo, FaRegWindowClose } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { Input } from "../../ui/input";
import Selector from "../Selector";
import { useQuery } from "@tanstack/react-query";
import { getAllEmployeeOwnerShip } from "@/API/admin/adminDashborad";
import { Combobox } from "../Handle";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Calendar1Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { getStatus } from "@/utils/statusUtils";
import { getpriority } from "@/utils/prorityUtils";
import { getEmpMails } from "@/API/user/userVerify/userVerfiy";

/* eslint-disable react/prop-types */
export const UserTaskDetailsModal = ({ task, onClose, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task);
  const [errorMessage, setErrorMessage] = useState("");
  const [ownershipOptions, setOwnershipOptions] = useState([]);

  const EndDate = useRef(null);
  const StartDate = useRef(null);
  
  const {
    isError: isUserListError,
    isLoading: isUserListLoading,
    error: UserListError,
    data: userList = [],
  } = useQuery({
    queryKey: ["userList"],
    queryFn: getEmpMails,
  });

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getAllEmployeeOwnerShip,
  });

  // console.log(formData);
  // console.log(userList);
  // Map user data into dropdown options when data is available
  useEffect(() => {
    if (userData) {
      const options = [
        // ...userData.teamLeads
        //   .filter((lead) => lead.admin_verify === "true") // Check admin_verify for team leads
        //   .map((lead) => ({
        //     value: lead.id,
        //     label: `Team Lead - ${lead.name}`,
        //   })),

        ...userData.managers
          .filter((manager) => manager.admin_verify === "true") // Check admin_verify for managers
          .map((manager) => ({
            value: manager.id,
            label: `Manager - ${manager.name}`,
          })),
      ];
      setOwnershipOptions(options);
    }
  }, [userData]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  if (!task) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Regular", label: "Regular" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" },
  ];

  const statusOptions = [
    { value: "Not Started", label: "Not Started" },
    { value: "In progress", label: "In Progress" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  if (isError) {
    return <p>Error fetching user list{error}</p>;
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isUserListError) {
    return <p>Error fetching user list{UserListError}</p>;
  }

  if (isUserListLoading) {
    return <p>Loading user list...</p>;
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (JSON.stringify(formData) === JSON.stringify(task)) {
      setErrorMessage("No changes were made.");
    } else {
      setErrorMessage(""); // Clear error message
      onEdit(formData); // Submit changes if there are any
    }
  };

  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white absolute right-4 bottom-4 overflow-scroll 2xl:w-[30rem] w-[25rem] h-[85%] rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-slate-400 text-white h-14 flex items-center justify-between px-6 rounded-t-xl sticky top-0 z-50">
          <h1 className="text-lg font-semibold">Task Overview</h1>
          <div className="flex gap-x-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
              >
                {isEditing ? (
                  <>
                    <FaRedo size={20} />
                  </>
                ) : (
                  <>
                    <FaPen size={20} />
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-white hover:text-red-600 transition-colors"
            >
              <FaRegWindowClose size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 ">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">
            {task.project?.project_name}
          </h2>

          <hr className="bg-taskBlack h-[0.1rem] border-0" />

          {isEditing ? (
            <>
              <div className="mb-4">
                <Selector
                  label="Priority"
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    handleSelectChange("priority", e.target.value)
                  }
                  options={priorityOptions}
                />
              </div>
              {renderInput("task_title", "Task Title", formData.task_title)}

              <Textarea
                value={formData.task_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    task_description: e.target.value,
                  })
                }
                label="Task Description"
                rows="5"
                className="w-full"
              />

              <div className="mb-4">
                <Selector
                  label="Priority"
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    handleSelectChange("priority", e.target.value)
                  }
                  options={priorityOptions}
                />
              </div>

              <div className="mb-4">
                <Selector
                  label="Status"
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleSelectChange("status", e.target.value)}
                  options={statusOptions}
                />
              </div>

              <div className="mb-4">
                <Label>Start Date</Label>
                <Input
                  onClick={() => StartDate.current.showPicker()}
                  ref={StartDate}
                  id="StartDate"
                  name="StartDate"
                  type="date"
                  value={
                    formData.start_date ? formData.start_date.split("T")[0] : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <Label>End Date</Label>
                <Input
                  onClick={() => EndDate.current.showPicker()}
                  ref={EndDate}
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={
                    formData.end_date ? formData.end_date.split("T")[0] : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <Label>Assigned to</Label>
                <Combobox
                  items={userList.map((user) => ({
                    value: user.value,
                    label: user.label,
                  }))}
                  value={formData.assigned_to?._id}
                  onChange={(value) => {
                    const selectedUser = userList.find(
                      (user) => user.value === value
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      assigned_to: {
                        _id: selectedUser.value,
                        name: selectedUser.label,
                      },
                    }));
                  }}
                  placeholder="Assigned to"
                />
              </div>

              <div className="mb-4">
                <Label>Report to</Label>
                <Combobox
                  items={ownershipOptions}
                  value={formData.report_to?._id}
                  onChange={(value) => {
                    const selectedOwner = ownershipOptions.find(
                      (option) => option.value === value
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      report_to: {
                        _id: selectedOwner.value,
                        name: selectedOwner.label.split(" - ")[1],
                      },
                    }));
                  }}
                  placeholder="Report to"
                />
              </div>

              <Button onClick={handleSave} className="mb-4">
                Update Task
              </Button>
            </>
          ) : (
            <>
              <div className="py-4 p-2">
                <h3 className="text-xl font-semibold text-blue-800">
                  {task.task_title}
                </h3>
                <p className="text-gray-600 text-sm">{task.task_description}</p>
              </div>
              <div className="space-y-2 flex flex-col border border-blue-300 bg-slate-50 shadow-minimal py-4 px-2 rounded-xl">
                <p className="text-sm text-taskBlack inline-flex items-center justify-between">
                  <span className="font-medium">Assigned To:</span>{" "}
                  {task.assigned_to?.name || "No name available"}
                </p>
                <p className="text-sm text-taskBlack inline-flex items-center justify-between">
                  <span className="font-medium">Report To:</span>{" "}
                  {task.report_to?.name || "No name available"}
                </p>
                <p className="text-sm inline-flex items-center justify-between">
                  Priority:
                  <span className={`font-medium ${getpriority(task.priority)}`}>
                    {task.priority}
                  </span>
                </p>
                <p className="text-sm inline-flex items-center justify-between">
                  Status:
                  <span className={`font-medium ${getStatus(task.status)}`}>
                    {task.status}
                  </span>{" "}
                </p>
                <p className="text-sm text-taskBlack inline-flex items-center justify-between">
                  <span className="font-medium">Timeline:</span>
                  {new Date(task.start_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(task.end_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-4 mt-3 overflow-y-auto h-40 p-2">
                <h2 className="flex items-center text-lg font-semibold text-gray-800">
                  Daily Updates <Calendar1Icon className="ml-2 text-gray-500" />
                </h2>
                {task.daily_updates && task.daily_updates.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {task.daily_updates.map((daily_update) => (
                      <li
                        key={daily_update._id}
                        className="flex justify-between"
                      >
                        <span>{daily_update.description}</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(daily_update.date).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No Updates Yet</p>
                )}
              </div>
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
