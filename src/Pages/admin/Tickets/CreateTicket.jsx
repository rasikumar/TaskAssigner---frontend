import { useRef, useState } from "react";

import { getAllProjectList } from "@/API/admin/projects/project_api";
import { getTaskRelatedToProject } from "@/API/admin/task/task_api";
import { getEmpMails } from "@/API/admin/userverify/userVerify";

import { useQuery } from "@tanstack/react-query";

import { Combobox } from "@/components/customUi/Handle";
import Modal from "@/components/customUi/Modal";
import Selector from "@/components/customUi/Selector";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { priorityOptions } from "@/utils/prorityOptions";
import { severityOptions } from "@/utils/severityOptions";
import {
  mainCategoryOptions,
  subCategoryMapping,
} from "@/utils/categoriesOptions";

import TicketHook from "@/hooks/ticket/TicketHook";

import { FaTicketAlt } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    tasks: "",
    severity: "",
    assigned_to: "",
    priority: "",
    status: "Open",
    main_category: "",
    sub_category: "",
    attachments: [],
    start_date: "",
    end_date: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [task, setTask] = useState([]);
  const [taskError, setTaskError] = useState("");
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  // console.log(formData);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
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

  const sendProjectId = async (projectId) => {
    try {
      const response = await getTaskRelatedToProject(projectId);
      setTask(response);
    } catch (error) {
      console.error("Error sending project ID:", error);
      toast.error("Failed to fetch tasks related to the project.");
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "main_category") {
      const subOptions = subCategoryMapping[value] || [];
      setSubCategoryOptions(subOptions);
      setFormData((prevData) => ({
        ...prevData,
        sub_category: "", // Reset subCategory when mainCategory changes
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // 10 MB limit

    if (validFiles.length !== files.length) {
      toast.error("Some files exceed the 10 MB size limit.");
    }

    setFormData((prevData) => ({
      ...prevData,
      attachments: [...prevData.attachments, ...validFiles],
    }));
  };

  const { createTicketMutation } = TicketHook();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.title) {
      toast.error("Title is required.");
      return;
    }
    if (!formData.description) {
      toast.error("Description is required.");
      return;
    }
    if (!formData.project) {
      toast.error("Project is required.");
      return;
    }
    if (!formData.tasks) {
      toast.error("Task is required.");
      return;
    }
    if (!formData.assigned_to) {
      toast.error("Assigned to is required.");
      return;
    }
    if (!formData.priority) {
      toast.error("Priority is required.");
      return;
    }
    if (!formData.severity) {
      toast.error("Severity is required.");
      return;
    }
    if (!formData.main_category) {
      toast.error("Main category is required.");
      return;
    }
    if (!formData.sub_category) {
      toast.error("Sub category is required.");
      return;
    }
    if (!formData.start_date) {
      toast.error("Start date is required.");
      return;
    }
    if (!formData.end_date) {
      toast.error("End date is required.");
      return;
    }

    const formDataToSend = new FormData();

    // Append attachments
    formData.attachments.forEach((file) => {
      formDataToSend.append("attachments", file);
    });

    // Append other form data fields
    for (const key in formData) {
      if (key !== "attachments") {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Debugging: Log all FormData entries
    // for (let pair of formDataToSend.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }

    // Send the FormData using your mutation
    createTicketMutation.mutate(formDataToSend, {
      onSuccess: () => {
        setFormData({
          title: "",
          description: "",
          project: "",
          tasks: "",
          severity: "",
          assigned_to: "",
          priority: "",
          status: "Open",
          main_category: "",
          sub_category: "",
          attachments: [],
          start_date: "",
          end_date: "",
        });
        setIsOpen(false);
        setStep(1);
      },
    });
  };

  const handleNextStep = (currentStep) => {
    if (currentStep === 2 && !formData.tasks) {
      setTaskError("Please select a Task before proceeding.");
      return;
    }
    if (currentStep === 3) {
      if (!formData.assigned_to) {
        toast.error("Assigned to is required.");
        return;
      }
      if (!formData.priority) {
        toast.error("Priority is required.");
        return;
      }
      if (!formData.severity) {
        toast.error("Severity is required.");
        return;
      }
      if (!formData.main_category) {
        toast.error("Main category is required.");
        return;
      }
      if (!formData.sub_category) {
        toast.error("Sub category is required.");
        return;
      }
      if (!formData.start_date) {
        toast.error("Start date is required.");
        return;
      }
      if (!formData.end_date) {
        toast.error("End date is required.");
        return;
      }
    }
    setStep(currentStep + 1);
  };

  return (
    <div>
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 w-fit"
      >
        Create Ticket <FaTicketAlt />
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen((prev) => !prev)}
          title="Create A Ticket"
        >
          {step === 1 && (
            <>
              {isProjectError ? (
                <>Project Fetch Error: {projectError?.message}</>
              ) : isProjectLoading ? (
                <p className="animate-spin fixed">
                  <VscLoading />
                </p>
              ) : (
                <Combobox
                  items={projectlist}
                  value={formData.project}
                  onChange={(value) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      project: value,
                    }));
                    sendProjectId(value);
                    setStep(2);
                  }}
                />
              )}
            </>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Selector
                label="Tasks"
                id="tasks"
                value={formData.tasks}
                onChange={(e) => {
                  const selectedTask = e.target.value;
                  handleSelectChange("tasks", selectedTask);

                  if (selectedTask) {
                    setTaskError("");
                  }
                  setStep(3);
                }}
                options={task.map((tas) => ({
                  value: tas._id,
                  label: tas.task_title,
                }))}
                required
              />
              {taskError && (
                <div className="text-sm text-red-500">{taskError}</div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline">
                  Back
                </Button>
                <Button onClick={() => handleNextStep(2)}>Next</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-4 overflow-auto h-96">
              <div className="mb-2">
                Assigned to
                {isUserListError ? (
                  <p>User List Error: {UserListError?.message}</p>
                ) : isUserListLoading ? (
                  <p className="animate-spin fixed">
                    <VscLoading />
                  </p>
                ) : (
                  <Combobox
                    items={userList}
                    value={formData.assigned_to}
                    onChange={(value) =>
                      handleSelectChange("assigned_to", value)
                    }
                  />
                )}
              </div>
              <Selector
                label="Priority"
                id="priority"
                value={formData.priority}
                onChange={(e) => handleSelectChange("priority", e.target.value)}
                options={priorityOptions}
                required
              />
              <Selector
                label="Severity"
                id="severity"
                value={formData.severity}
                onChange={(e) => handleSelectChange("severity", e.target.value)}
                options={severityOptions}
                required
              />
              <Selector
                label="Main Category"
                id="main_category"
                value={formData.main_category}
                onChange={(e) =>
                  handleSelectChange("main_category", e.target.value)
                }
                options={mainCategoryOptions}
                required
              />
              <Selector
                label="Sub Category"
                id="sub_category"
                value={formData.sub_category}
                onChange={(e) =>
                  handleSelectChange("sub_category", e.target.value)
                }
                options={subCategoryOptions}
                disabled={!formData.main_category}
                required
              />
              <div>
                <Label htmlFor="start_date">Start Date:</Label>
                <Input
                  onClick={() => startDateRef.current.showPicker()}
                  ref={startDateRef}
                  type="date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) =>
                    handleSelectChange("start_date", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date:</Label>
                <Input
                  onClick={() => endDateRef.current.showPicker()}
                  ref={endDateRef}
                  type="date"
                  id="end_date"
                  value={formData.end_date}
                  onChange={(e) =>
                    handleSelectChange("end_date", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Prev
                </Button>
                <Button onClick={() => handleNextStep(3)}>Next</Button>
              </div>
            </div>
          )}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="title">Title:</Label>
                <Input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleSelectChange("title", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description:</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleSelectChange("description", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="attachments">Attachments:</Label>
                <Input
                  type="file"
                  multiple
                  id="attachments"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Prev
                </Button>
                <Button type="submit" disabled={createTicketMutation.isLoading}>
                  {createTicketMutation.isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default CreateTicket;
