import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { GrClose } from "react-icons/gr";
import { Textarea } from "@/components/ui/textarea"; // Custom textarea component
import { Input } from "@/components/ui/input"; // Custom input component
import { Button } from "@/components/ui/button"; // Custom button component
import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

import { createTask } from "@/API/admin/task/task_api";
import { userGetAllProjectList } from "@/API/user/projects/project";
import { getEmpMails } from "@/API/user/userVerify/userVerfiy";
import { getMilestonesForProject } from "@/API/user/milestone/milestone";
import { getAllEmployeeOwnerShip } from "@/API/user/dashboard/dashboard";

import Selector from "@/components/customUi/Selector";
import Modal from "@/components/customUi/Modal";
import { Combobox } from "@/components/customUi/Handle";
const CreateTaskUser = () => {
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
  // console.log(formData);

  const queryClient = useQueryClient();

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [step, setStep] = useState(1); // Step 1: Project selection, Step 2: Task details
  const [isOpen, setIsOpen] = useState(false);
  const [ownershipOptions, setOwnershipOptions] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [milestonesError, setMilestoneError] = useState("");

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Regular", label: "Regular" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" },
  ];

  const {
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
    data: projectlist = [],
  } = useQuery({
    queryKey: ["projectsList"],
    queryFn: userGetAllProjectList,
    enabled: isOpen,
  });

  // console.log(projectlist);

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
    enabled: isOpen, // Only fetch when the dialog is open
  });

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

  const Taskmutations = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setFormData({
        project: null,
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
      setMilestones([]); // Clear milestones if needed
      setOwnershipOptions([]); // Reset ownership options
      setIsOpen(false);
      setStep(1);
      toast.success("Tasks Created Successfully");
    },
    onError: (err) => {
      toast.error(
        err.response.data.message ||
          "Network error. Please check your connection."
      );
      console.error("Error creating project:", err);
    },
  });
  // console.log(userList);
  // console.log(ownershipOptions);

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendProjectId = async (projectId) => {
    try {
      const response = await getMilestonesForProject(projectId);
      setMilestones(response);
    } catch (error) {
      console.error("Error sending project ID:", error);
    }
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    Taskmutations.mutate(formData);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="w-fit">
        Create Task <FaPlus />
      </Button>

      {/* Main Form */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Task"
      >
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center "
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h2 className="text-xl font-bold mb-4 inline-flex items-center justify-between w-full">
                Create Task{" "}
                <GrClose
                  className="cursor-pointer hover:text-red-500 transition-all"
                  onClick={() => setIsOpen(false)}
                />
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Fill in the details below to create a new task.
              </p>

              {/* Step 1: Select Project */}

              {step === 1 && (
                <>
                  {isProjectError ? (
                    <>
                      <p>UserData Fetch {projectError.message}</p>
                    </>
                  ) : isProjectLoading ? (
                    <>
                      <p className="animate-spin fixed">
                        <VscLoading />
                      </p>
                    </>
                  ) : (
                    <Combobox
                      items={projectlist} // Array of projects
                      value={formData.project} // Controlled state
                      onChange={(value) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          project: value, // Update the project value in the form data
                        }));
                        sendProjectId(value); // Send the project ID to the API
                        setStep(2); // Move to the next step
                      }}
                      placeholder="Select a project..."
                    />
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
                      const selectedMilestone = e.target.value;
                      handleSelectChange("milestone", selectedMilestone);

                      if (selectedMilestone) {
                        setMilestoneError("");
                      }
                    }}
                    options={milestones.map((milestone) => ({
                      value: milestone._id,
                      label: milestone.name,
                    }))}
                    required={true}
                  />
                  {milestonesError && (
                    <div className="text-sm text-red-500">
                      {milestonesError}
                    </div>
                  )}
                  <div className="flex gap-x-2">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        if (!formData.milestone) {
                          setMilestoneError(
                            "Please select a milestone before proceeding."
                          );
                          return;
                        }
                        setStep(3);
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <div className="flex flex-col gap-4">
                    {isUserListError ? (
                      <>
                        <p>UserData Fetch {UserListError.message}</p>
                      </>
                    ) : (
                      <>
                        {isUserListLoading ? (
                          <>
                            <p className="animate-spin fixed">
                              <VscLoading />
                            </p>
                          </>
                        ) : (
                          <Combobox
                            items={userList} // Array of projects
                            value={formData.assigned_to} // Controlled state
                            onChange={(value) => {
                              setFormData((prevData) => ({
                                ...prevData,
                                assigned_to: value, // Update the project value in the form data
                              }));
                            }}
                            placeholder="Assigned to"
                          />
                        )}
                      </>
                    )}
                    {isUserDataError ? (
                      <>
                        <p>UserList Error {UserDataError.message}</p>
                      </>
                    ) : isUserDataLoading ? (
                      <>
                        <p className="animate-spin fixed">
                          <VscLoading />
                        </p>
                      </>
                    ) : (
                      <Combobox
                        items={ownershipOptions} // Array of projects
                        value={formData.report_to} // Controlled state
                        onChange={(value) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            report_to: value, // Update the project value in the form data
                          }));
                          setStep(3); // Move to the next step
                        }}
                        placeholder="Report to"
                      />
                    )}
                    <div className="flex gap-x-2">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button onClick={() => setStep(4)}>Next</Button>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 2: Task Details */}
              {step === 4 && (
                <form onSubmit={handleSumbit} className="space-y-6">
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
                      onChange={(e) =>
                        handleSelectChange("task_title", e.target.value)
                      }
                      required
                      className="mt-2 p-2 border rounded-md w-full"
                      placeholder="Enter task title"
                    />
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
                      onChange={(e) =>
                        handleSelectChange("task_description", e.target.value)
                      }
                      required
                      className="mt-2 p-2 border rounded-md w-full"
                      placeholder="Enter task description"
                    />
                  </div>

                  <div className="flex items-center gap-5">
                    {/* <label
                      htmlFor="start_date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label> */}
                    <Input
                      onClick={() => startDateRef.current.showPicker()}
                      ref={startDateRef}
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        handleSelectChange("start_date", e.target.value)
                      }
                      className="mt-2 p-2 border rounded-md transition-all delay-300"
                    />

                    {/* <label
                      htmlFor="end_date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label> */}
                    <span>To</span>
                    <Input
                      onClick={() => endDateRef.current.showPicker()}
                      ref={endDateRef}
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        handleSelectChange("end_date", e.target.value)
                      }
                      className="mt-2 p-2 border rounded-md"
                    />
                  </div>

                  <div>
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

                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      variant="outline"
                    >
                      Back
                    </Button>
                    <Button type="submit">Create Task</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default CreateTaskUser;
