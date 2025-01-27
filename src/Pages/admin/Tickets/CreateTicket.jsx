import { getAllProjectList } from "@/API/admin/projects/project_api";
import { getTaskRelatedToProject } from "@/API/admin/task/task_api";
import { getEmpMails } from "@/API/admin/userverify/userVerify";
import { Combobox } from "@/components/customUi/Handle";
import Modal from "@/components/customUi/Modal";
import Selector from "@/components/customUi/Selector";
import { Button } from "@/components/ui/button";
import { priorityOptions } from "@/utils/prorityOptions";
import { severityOptions } from "@/utils/severityOptions";
import {
  mainCategoryOptions,
  subCategoryMapping,
} from "@/utils/categoriesOptions";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { FaTicketAlt } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TicketHook from "@/hooks/ticket/ticketHook";
import { ToastContainer } from "react-toastify";

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
  });
  // console.log(formData);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [task, setTask] = useState([]);
  const [taskError, setTaskError] = useState("");
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const fileInputRef = useRef(null);

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
    const attachments = e.target.files[0];
    // console.log(attachments)
    setFormData((prevData) => ({
      ...prevData,
      file: attachments,
      fileName: attachments.name,
    }));
  };

  const removeFile = () => {
    setFormData((prevData) => ({
      ...prevData,
      file: null,
      fileName: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //   const mutation = useMutation({
  //     mutationFn: async (formDataToSend) => {
  //       // Replace with your API call
  //       return await apiCallToSendData(formDataToSend);
  //     },
  //     onSuccess: () => {
  //       // Handle success (e.g., show a success message, close the modal, etc.)
  //       setIsOpen(false);
  //     },
  //         onError: (error) => {
  //         // Handle error (e.g., show an error message)
  //         console.error("Error submitting form:", error);
  //         },
  //   });

  const { createTicketMutation } = TicketHook();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    // console.log(formDataToSend);
    createTicketMutation.mutate(formDataToSend);
    // toast.success("Task created successfully!");
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
                <>Project Fetch Error: {projectError.message}</>
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
                required={true}
              />
              {taskError && (
                <div className="text-sm text-red-500">{taskError}</div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline">
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (!formData.tasks) {
                      setTaskError("Please select a Task before proceeding.");
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
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                Assigned to
                {isUserListError ? (
                  <p>User List Error: {UserListError.message}</p>
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
                required={true}
              />
              <Selector
                label="Severity"
                id="severity"
                value={formData.severity}
                onChange={(e) => handleSelectChange("severity", e.target.value)}
                options={severityOptions}
                required={true}
              />
              <Selector
                label="Main Category"
                id="main_category"
                value={formData.main_category}
                onChange={(e) =>
                  handleSelectChange("main_category", e.target.value)
                }
                options={mainCategoryOptions}
                required={true}
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
                required={true}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Prev
                </Button>
                <Button onClick={() => setStep(4)}>Next</Button>
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
              <div className="flex items-center border px-4">
                {!formData.file ? (
                  <Input
                    type="file"
                    className="border-none"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                ) : (
                  <div
                    className="flex items-center justify-between w-full"
                    onClick={removeFile}
                  >
                    <span className="text-sm ">Choose File</span>
                    <div className="flex gap-2 items-center justify-between m-auto">
                      <span>{formData.fileName}</span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={removeFile}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Prev
                </Button>
                <Button type="submit">Submit</Button>
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
