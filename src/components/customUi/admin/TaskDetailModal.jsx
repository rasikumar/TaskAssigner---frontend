/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import { getEmpMails } from "@/API/admin/userverify/userVerify";
import { getAllEmployeeOwnerShip } from "@/API/admin/adminDashborad";
import { deleteDailyTaskUpdate } from "@/API/admin/task/task_api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DeleteDialog from "@/components/DeleteDialog";

import { Input } from "../../ui/input";
import Selector from "../Selector";
import { Combobox } from "../Handle";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

import { getStatus } from "@/utils/statusUtils";
import { getpriority } from "@/utils/prorityUtils";
import { priorityOptions } from "@/utils/prorityOptions";
import { statusOptions } from "@/utils/statusOptions";

import { Calendar1Icon } from "lucide-react";
import { FaPen, FaRedo, FaRegWindowClose, FaTrash } from "react-icons/fa";
import { VscLoading, VscMilestone } from "react-icons/vsc";
import DatePicker from "@/components/Datepicker";
export const TaskDetailsModal = ({ task, onClose, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task);
  const [errorMessage, setErrorMessage] = useState("");
  const [ownershipOptions, setOwnershipOptions] = useState([]);
  const [formTouched, setFormTouched] = useState(false); // New state to track form submission

  const queryClient = useQueryClient();

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
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    error: userDataError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getAllEmployeeOwnerShip,
  });

  const {
    mutate: mutate,
    isLoading: isDailyUpdateDeleteLoading,
    isError: isDailyUpdateError,
    error: DailyUpdateError,
  } = useMutation({
    mutationFn: async (_id, updateId) => {
      const response = await deleteDailyTaskUpdate(_id, updateId);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      if (data && data.status) {
        toast.success(data?.message);
        setIsVisible(false);
      } else {
        console.error("Failed to delete daily update:", data?.message);
      }
    },
    onError: (error) => {
      console.error("Error deleting daily update:", error);
      toast.error("Error deleting daily update.");
    },
  });
  const handleDeleteDailyUpdate = async (_id, updateId) => {
    mutate({ _id, updateId });
  };

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
          .filter(
            (manager) =>
              manager.admin_verify === true && manager.hr_approval === true
          ) // Check admin_verify for managers
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

  const renderInput = (name, label, value, error) => (
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
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const handleSave = (e) => {
    e.preventDefault();
    setFormTouched(true);

    // Validation for task title and description
    if (formData.task_title.trim().length < 5) {
      setErrorMessage("Task title must be at least 5 characters long.");
      return;
    }

    if (formData.task_description.trim().length < 10) {
      setErrorMessage("Task description must be at least 10 characters long.");
      return;
    }

    if (JSON.stringify(formData) === JSON.stringify(task)) {
      setErrorMessage("No changes were made.");
    } else {
      setErrorMessage(""); // Clear error message
      onEdit(formData); // Submit changes if there are any
    }
  };

  // const handleDeleteDailyUpdate = async (taskId, updateId) => {
  //     await deleteDailyTaskUpdate(taskId, updateId);

  // };

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
                <FaPen size={20} />
              </button>
            )}

            {isEditing && (
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <FaRedo size={20} />
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
              {renderInput(
                "task_title",
                "Task Title",
                formData.task_title,
                formTouched && formData.task_title.trim().length < 5
                  ? "Task title must be at least 5 characters long."
                  : ""
              )}

              <Textarea
                value={formData.task_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    task_description: e.target.value,
                  })
                }
                rows="5"
                className="w-full"
              />
              {formTouched && formData.task_description.trim().length < 10 && (
                <p className="text-red-500 text-xs mt-1">
                  Task description must be at least 10 characters long.
                </p>
              )}

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

              <div className="mb-4 flex flex-col">
                <Label>Start Date</Label>
                <DatePicker
                  selectedDate={formData.start_date}
                  onChange={(date) =>
                    setFormData({ ...formData, start_date: date })
                  }
                  placeholder="Select Start Date"
                />
              </div>

              <div className="mb-4 flex flex-col">
                <Label>End Date</Label>
                <DatePicker
                  selectedDate={formData.end_date}
                  onChange={(date) =>
                    setFormData({ ...formData, end_date: date })
                  }
                  placeholder="Select End Date"
                />
              </div>

              <div className="mb-4">
                <Label>Assigned to</Label>
                {isUserListError ? (
                  <>Error fetching user list{UserListError}</>
                ) : isUserListLoading ? (
                  <>
                    <p className="animate-spin fixed">
                      <VscLoading />
                    </p>
                  </>
                ) : (
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
                )}
              </div>
              <div className="mb-4">
                <Label>Report to</Label>
                {isUserDataError ? (
                  <>Error fetching user list{userDataError}</>
                ) : isUserDataLoading ? (
                  <>
                    <p className="animate-spin fixed">
                      <VscLoading />
                    </p>
                  </>
                ) : (
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
                )}
              </div>

              <Button onClick={handleSave} className="mb-4">
                Update Task
              </Button>
            </>
          ) : (
            <>
              <div className="py-4 p-2">
                <h3 className="text-lg font-semibold border border-blue-400 rounded-md px-2 mb-4 inline-flex items-center gap-4 w-full">
                  <VscMilestone />
                  {task.milestone?.name || "No Milestone"}
                </h3>
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
              <div className="flex flex-col gap-4 mt-3 overflow-y-scroll overflow-x-hidden p-2">
                <h2 className="flex items-center gap-4 text-lg font-semibold text-gray-800">
                  Daily Updates <Calendar1Icon className="ml-2 text-gray-500" />
                </h2>
                {task.daily_updates && task.daily_updates.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {task.daily_updates
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((daily_update) => (
                        <li
                          key={daily_update._id}
                          className="flex justify-between items-start"
                        >
                          <span className="w-52 overflow-x-scroll h-20 break-words">
                            {daily_update.description}
                          </span>

                          <span className="text-gray-500 text-xs inline-flex items-center gap-2">
                            <p className="text-gray-500 text-xs inline-flex items-center justify-end gap-2 border-r-2 pr-2">
                              <span className="text-primary text-sm">
                                {daily_update.hours_spent}
                              </span>
                              Hours
                            </p>
                            {new Date(daily_update.date).toLocaleString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}

                            <DeleteDialog
                              message="Are you sure you want to delete this task?"
                              onConfirm={() =>
                                handleDeleteDailyUpdate(
                                  task._id,
                                  daily_update._id
                                )
                              }
                              triggerLabel={
                                isDailyUpdateError ? (
                                  `Error ${DailyUpdateError}`
                                ) : isDailyUpdateDeleteLoading ? (
                                  <VscLoading />
                                ) : (
                                  <FaTrash />
                                )
                              }
                              // isLoading={deleteMutation.isPending}
                              className="w-4 h-8"
                            />
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
