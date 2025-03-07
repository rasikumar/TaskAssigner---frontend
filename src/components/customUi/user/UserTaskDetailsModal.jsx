import { FaPen, FaRedo, FaRegWindowClose } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { Input } from "../../ui/input";
import Selector from "../Selector";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEmployeeOwnerShip } from "@/API/admin/adminDashborad";
import { Combobox } from "../Handle";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Calendar1Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { getStatus } from "@/utils/statusUtils";
import { getpriority } from "@/utils/prorityUtils";
import { getEmpMails } from "@/API/user/userVerify/userVerfiy";
import { VscLoading, VscMilestone } from "react-icons/vsc";
import UserDailyUpdateTask from "../../../Pages/user/tasks/UserDailyUpdateTask";
import { dailyUpdate, StatusUpdate } from "@/API/user/task/tasks";
import { toast, ToastContainer } from "react-toastify";
import RoleChecker from "@/lib/RoleChecker";
import MoveToTester from "@/Pages/user/tasks/MoveToTester";
import { moveToTester } from "@/API/user/ticket/ticket";

/* eslint-disable react/prop-types */
export const UserTaskDetailsModal = ({ task, onClose, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task);
  const [errorMessage, setErrorMessage] = useState("");
  const [ownershipOptions, setOwnershipOptions] = useState([]);
  const [status, setStatus] = useState("");

  const queryClient = useQueryClient();

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
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    error: UserDataError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getAllEmployeeOwnerShip,
  });

  const DailyTaskmutation = useMutation({
    mutationFn: dailyUpdate,
    onError: () => {
      toast.error("Failed to send daily update!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh the data
      toast.success("Daily update sent successfully!");
    },
  });

  const TaskUpdate = useMutation({
    mutationFn: StatusUpdate,
    onError: (err) => {
      toast.error(err.message || "Failed to update task status!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh the data
      setIsVisible(false);
      toast.success("Update task status successfully!");
    },
  });

  const UatStatusChange = useMutation({
    mutationFn: moveToTester,
    onError: (err) => {
      toast.error(err.message || "Failed to move to UAT!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh the data
      setIsVisible(false);
      toast.success("Task moved to UAT successfully!");
    },
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

  const handleStatusChange = (_id, value) => {
    // console.log(_id, value);
    setStatus(value);
    TaskUpdate.mutate({ _id: _id, status: value });
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

  const handleSave = (e) => {
    e.preventDefault();
    if (JSON.stringify(formData) === JSON.stringify(task)) {
      setErrorMessage("No changes were made.");
    } else {
      setErrorMessage(""); // Clear error message
      onEdit(formData); // Submit changes if there are any
    }
  };

  const onUpdate = (onUpdate) => {
    // console.log(onUpdate);
    DailyTaskmutation.mutate(onUpdate);
  };

  const move_to_uat = (move_to_uat, _id) => {
    UatStatusChange.mutate({ move_to_uat, _id });
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
            <RoleChecker
              allowedRoles={["team lead", "manager"]}
              allowedDepartments={["development"]}
            >
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
            </RoleChecker>
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
                {isUserListError ? (
                  <>
                    <p>userListFetch Error {UserListError.message}</p>
                  </>
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
                  <>
                    <p>UserDataFetch Error {UserDataError.message}</p>
                  </>
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
                <RoleChecker
                  allowedRoles={["member"]}
                  allowedDepartments={["development"]}
                >
                  <div>
                    <h2 className="flex items-center gap-4 text-lg font-semibold text-gray-800">
                      Daily Updates{" "}
                      <Calendar1Icon className="ml-2 text-gray-500" />
                      <MoveToTester
                        _id={task._id}
                        move_to_uat={move_to_uat}
                        testerDetail={task.move_to_uat}
                      />
                    </h2>

                    <Selector
                      label="Status"
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      options={statusOptions}
                    />
                  </div>

                  <UserDailyUpdateTask _id={task._id} onUpdate={onUpdate} />
                </RoleChecker>
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
                          <p className="text-gray-500 text-xs inline-flex items-center gap-4">
                            <span className="text-primary text-base">
                              {daily_update.hours_spent}
                            </span>
                            Hours spent
                          </p>
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
      <ToastContainer />
    </div>
  );
};
