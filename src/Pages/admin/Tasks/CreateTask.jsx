import { getAllProjectList } from "@/API/admin/projects/project_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Combobox } from "@/components/customUi/Handle";
import Modal from "@/components/customUi/Modal";
import Selector from "@/components/customUi/Selector";
import { getEmpMails } from "@/API/admin/userverify/userVerify";
import { getAllEmployeeOwnerShip } from "@/API/admin/adminDashborad";
import { createTask } from "@/API/admin/task/task_api";
import { toast, ToastContainer } from "react-toastify";
import { getMilestonesForProject } from "@/API/admin/milestone/milestone";
import { VscLoading } from "react-icons/vsc";
import { priorityOptions } from "@/utils/prorityOptions";
import DatePicker from "@/components/Datepicker";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    project: null,
    milestone: "",
    task_title: "",
    task_description: "",
    assigned_to: "",
    assigned_by: "",
    report_to: "",
    status: "Not started",
    priority: "",
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState({
    task_title: "",
    task_description: "",
    project: "",
    milestone: "",
    assigned_to: "",
    report_to: "",
  });

  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [ownershipOptions, setOwnershipOptions] = useState([]);
  const [milestones, setMilestones] = useState([]);

  const {
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
    data: projectlist = [],
  } = useQuery({
    queryKey: ["projectsList"],
    queryFn: getAllProjectList,
    enabled: isOpen,
  });

  const {
    isError: isUserListError,
    isLoading: isUserListLoading,
    error: UserListError,
    data: userList = [],
  } = useQuery({
    queryKey: ["userList"],
    queryFn: getEmpMails,
    enabled: isOpen,
  });

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    error: UserDataError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getAllEmployeeOwnerShip,
    enabled: isOpen,
  });

  useEffect(() => {
    if (userData) {
      const options = [
        ...userData.managers
          .filter(
            (manager) =>
              manager.admin_verify === true && manager.hr_approval === true
          )
          .map((manager) => ({
            value: manager.id,
            label: `Manager - ${manager.name}`,
          })),
      ];
      setOwnershipOptions(options);
    }
  }, [userData]);

  const taskmutations = useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      setFormData({
        project: null,
        milestone: "",
        task_title: "",
        task_description: "",
        assigned_to: "",
        assigned_by: "",
        report_to: "",
        status: "Not Started",
        priority: "",
        start_date: "",
        end_date: "",
      });
      setMilestones([]);
      setOwnershipOptions([]);
      setIsOpen(false);
      setStep(1);
      toast.success(data?.message || "Task created successfully!");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "An error occurred while creating the task."
      );
    },
  });

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const sendProjectId = async (projectId) => {
    try {
      const response = await getMilestonesForProject(projectId);
      setMilestones(response);
    } catch (error) {
      console.error("Error sending project ID:", error);
    }
  };

  const handleNextStep = (currentStep) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (currentStep === 1 && !formData.project) {
      newErrors.project = "Please select a project before proceeding.";
      isValid = false;
    }

    if (currentStep === 2 && !formData.milestone) {
      newErrors.milestone = "Please select a milestone before proceeding.";
      isValid = false;
    }

    if (currentStep === 3) {
      if (!formData.assigned_to) {
        newErrors.assigned_to = "Please select 'Assigned to' before proceeding.";
        isValid = false;
      }
      if (!formData.report_to) {
        newErrors.report_to = "Please select 'Report to' before proceeding.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (isValid) {
      setStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { ...errors };

    if (formData.task_title.length < 5 || formData.task_title.length > 30) {
      newErrors.task_title = "Task title must be between 5 and 30 characters.";
      hasError = true;
    } else {
      newErrors.task_title = "";
    }

    if (
      formData.task_description.length < 10 ||
      formData.task_description.length > 100
    ) {
      newErrors.task_description =
        "Task description must be between 10 and 100 characters.";
      hasError = true;
    } else {
      newErrors.task_description = "";
    }

    setErrors(newErrors);
    if (hasError) return;

    taskmutations.mutate(formData);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="w-fit">
        Create Task
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Task"
      >
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details below to create a new task.
        </p>

        {step === 1 && (
          <>
            {isProjectError ? (
              <p className="text-red-500">Error fetching projects: {projectError.message}</p>
            ) : isProjectLoading ? (
              <div className="flex justify-center">
                <VscLoading className="animate-spin" />
              </div>
            ) : (
              <>
                <Combobox
                  items={projectlist}
                  value={formData.project}
                  onChange={(value) => {
                    handleSelectChange("project", value);
                    sendProjectId(value);
                  }}
                  placeholder="Select a project..."
                />
                {errors.project && (
                  <p className="text-sm text-red-500 mt-1">{errors.project}</p>
                )}
                <div className="flex gap-x-2 mt-4">
                  <Button
                    type="button"
                    onClick={() => handleNextStep(1)}
                    disabled={!formData.project}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-2">
            <Selector
              label="Milestone"
              id="milestone"
              value={formData.milestone}
              onChange={(e) => {
                handleSelectChange("milestone", e.target.value);
              }}
              options={milestones.map((milestone) => ({
                value: milestone._id,
                label: milestone.name,
              }))}
              required={true}
            />
            {errors.milestone && (
              <div className="text-sm text-red-500">{errors.milestone}</div>
            )}
            <div className="flex gap-x-2 mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                onClick={() => handleNextStep(2)}
                disabled={!formData.milestone}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            {isUserListError ? (
              <p className="text-red-500">Error fetching users: {UserListError.message}</p>
            ) : isUserListLoading ? (
              <div className="flex justify-center">
                <VscLoading className="animate-spin" />
              </div>
            ) : (
              <>
                <Combobox
                  items={userList}
                  value={formData.assigned_to}
                  onChange={(value) => {
                    handleSelectChange("assigned_to", value);
                  }}
                  placeholder="Assigned to"
                />
                {errors.assigned_to && (
                  <p className="text-sm text-red-500">{errors.assigned_to}</p>
                )}
              </>
            )}

            {isUserDataError ? (
              <p className="text-red-500">Error fetching managers: {UserDataError.message}</p>
            ) : isUserDataLoading ? (
              <div className="flex justify-center">
                <VscLoading className="animate-spin" />
              </div>
            ) : (
              <>
                <Combobox
                  items={ownershipOptions}
                  value={formData.report_to}
                  onChange={(value) => {
                    handleSelectChange("report_to", value);
                  }}
                  placeholder="Report to"
                />
                {errors.report_to && (
                  <p className="text-sm text-red-500">{errors.report_to}</p>
                )}
              </>
            )}

            <div className="flex gap-x-2 mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={() => handleNextStep(3)}
                disabled={!formData.assigned_to || !formData.report_to}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="task_title"
                className="block text-sm font-medium text-gray-700"
              >
                Task Title
              </label>
              <Input
                id="task_title"
                name="task_title"
                value={formData.task_title}
                onChange={(e) => {
                  handleSelectChange("task_title", e.target.value);
                }}
                required
                className="mt-2 p-2 border rounded-md w-full"
                placeholder="Enter task title"
              />
              {errors.task_title && (
                <p className="text-sm text-red-500">{errors.task_title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="task_description"
                className="block text-sm font-medium text-gray-700"
              >
                Task Description
              </label>
              <Textarea
                id="task_description"
                name="task_description"
                value={formData.task_description}
                onChange={(e) => {
                  handleSelectChange("task_description", e.target.value);
                }}
                required
                className="mt-2 p-2 border rounded-md w-full"
                placeholder="Enter task description"
              />
              {errors.task_description && (
                <p className="text-sm text-red-500">
                  {errors.task_description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <DatePicker
                selectedDate={formData.start_date}
                onChange={(date) => handleSelectChange("start_date", date)}
                placeholder="Start Date"
              />
              <span>To</span>
              <DatePicker
                selectedDate={formData.end_date}
                onChange={(date) => handleSelectChange("end_date", date)}
                placeholder="End Date"
              />
            </div>

            <div>
              <Selector
                label="Priority"
                id="priority"
                value={formData.priority}
                onChange={(e) => handleSelectChange("priority", e.target.value)}
                options={priorityOptions}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                type="button"
                onClick={() => setStep(3)}
                variant="outline"
              >
                Back
              </Button>
              <Button type="submit" disabled={taskmutations.isLoading}>
                {taskmutations.isLoading ? (
                  <span className="flex items-center">
                    <VscLoading className="animate-spin mr-2" />
                    Creating...
                  </span>
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default CreateTask;