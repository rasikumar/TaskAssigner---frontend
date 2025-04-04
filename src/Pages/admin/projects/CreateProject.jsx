import { useState, useRef, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProject } from "@/API/admin/projects/project_api";
import { getAllEmployeeOwnerShip } from "@/API/admin/adminDashborad";

import { PlusIcon, XIcon } from "lucide-react";
import Modal from "@/components/customUi/Modal";
import { GrClose } from "react-icons/gr";
import Selector from "@/components/customUi/Selector";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
    project_ownership: "",
    project_status: "Not Started",
    start_date: "",
    end_date: "",
    estimated_hours: "",
    milestones: [],
    attachment: [],
  });

  const [errors, setErrors] = useState({
    project_name: "",
    project_description: "",
    milestones: "",
    estimated_hours: "",
  });

  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [ownershipOptions, setOwnershipOptions] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [showMilestoneInput, setShowMilestoneInput] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Key to reset file input
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);

  const inputRef = useRef(null);
  const projectNameRef = useRef(null);
  const projectDescriptionRef = useRef(null);
  const estimatedHoursRef = useRef(null);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      project_name: "",
      project_description: "",
      milestones: "",
      estimated_hours: "",
    };

    if (formData.project_name.length < 10) {
      newErrors.project_name = "Project name must be at least 10 characters";
      valid = false;
      projectNameRef.current?.focus();
    }

    if (formData.project_description.length < 10) {
      newErrors.project_description =
        "Description must be at least 10 characters";
      valid = false;
      if (!newErrors.project_name) {
        projectDescriptionRef.current?.focus();
      }
    }

    if (formData.milestones.length === 0) {
      newErrors.milestones = "Please add at least one milestone";
      valid = false;
    }

    if (!formData.estimated_hours || formData.estimated_hours < 20) {
      newErrors.estimated_hours = "Estimated hours Minimum 20 Hours Required";
      valid = false;
      if (
        !newErrors.project_name &&
        !newErrors.project_description &&
        !newErrors.milestones
      ) {
        estimatedHoursRef.current?.focus();
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const mutations = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setFormData({
        project_name: "",
        project_description: "",
        project_ownership: "",
        project_status: "Not Started",
        start_date: "",
        end_date: "",
        estimated_hours: "",
        milestones: [],
        attachment: [],
      });
      setMilestones([]);
      setIsOpen(false);
      toast.success("Project Created Successfully");
    },
    onError: (err) => {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            toast.error(err.response.data.message || "Bad Request.");
            break;
          case 403:
            toast.error(
              err.response.data.message || "Forbidden: Access denied."
            );
            break;
          case 500:
            toast.error(err.response.data.message || "Server error occurred.");
            break;
          default:
            toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error(
          err.message || "Network error. Please check your connection."
        );
      }
      console.error("Error creating project:", err);
    },
  });

  const {
    data: userData,
    isLoading,
    isError,
    error,
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
              manager.admin_verify === true && manager.hr_approval == true
          )
          .map((manager) => ({
            id: manager.id,
            name: `Manager - ${manager.name}`,
          })),
      ];
      setOwnershipOptions(options);
    }
  }, [userData]);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Only clear error if the validation is actually fixed
    if (errors[name]) {
      let isValid = true;
      if (name === "project_name" && value.length < 10) isValid = false;
      if (name === "project_description" && value.length < 10) isValid = false;
      if (name === "estimated_hours" && (value === "" || value < 20))
        isValid = false;

      if (isValid) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }
  };

  const handleAddMilestone = () => {
    if (newMilestone.trim() !== "") {
      const updatedMilestones = [...milestones, newMilestone];
      setMilestones(updatedMilestones);
      setFormData((prevData) => ({
        ...prevData,
        milestones: updatedMilestones,
      }));
      setNewMilestone("");
      setShowMilestoneInput(false);

      // Clear milestones error if it exists
      if (errors.milestones && updatedMilestones.length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          milestones: "",
        }));
      }
    }
  };

  const handleRemoveMilestone = (index) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
    setFormData((prevData) => ({
      ...prevData,
      milestones: updatedMilestones,
    }));

    // Show error if no milestones left
    if (updatedMilestones.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        milestones: "Please add at least one milestone",
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => file.size <= 10 * 1024 * 1024 && file.type === "application/pdf"
    );

    if (validFiles.length !== files.length) {
      toast.error("Only PDF files under 10 MB are allowed.");
      // Reset the file input if invalid files were selected
      setFileInputKey(Date.now());
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      attachment: [...prevData.attachment, ...validFiles],
    }));
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = formData.attachment.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      attachment: updatedFiles,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();

    formData.attachment.forEach((file) => {
      formDataToSend.append("attachment", file);
    });

    formDataToSend.append("milestones", JSON.stringify(formData.milestones));

    for (const key in formData) {
      if (key !== "attachment" && key !== "milestones") {
        formDataToSend.append(key, formData[key]);
      }
    }

    mutations.mutate(formDataToSend);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-fit">
        Create Project
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Project"
      >
        {isOpen && (
          <div
            className="fixed inset-0 m-auto overflow-y-scroll z-50 bg-opacity-50 flex justify-center items-center overflow-scroll"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96 h-1/2 overflow-y-scroll"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="text-xl font-bold inline-flex justify-between items-center w-full">
                Create Project{" "}
                <GrClose
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer hover:text-red-500 transition-all"
                />
              </div>

              <div className="text-sm text-gray-500">
                Fill in the details below to create a new Project.
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Details</h3>
                  <div>
                    <Input
                      ref={projectNameRef}
                      id="project_name"
                      name="project_name"
                      value={formData.project_name}
                      onChange={(e) =>
                        handleSelectChange("project_name", e.target.value)
                      }
                      required
                      placeholder="Enter project title"
                    />
                    {errors.project_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.project_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Textarea
                      ref={projectDescriptionRef}
                      id="project_description"
                      name="project_description"
                      value={formData.project_description}
                      onChange={(e) =>
                        handleSelectChange(
                          "project_description",
                          e.target.value
                        )
                      }
                      required
                      placeholder="Enter project description"
                      className="outline-none focus:ring-0 focus:ring-offset-0 "
                    />
                    {errors.project_description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.project_description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ownership</h3>
                  <div>
                    <Selector
                      id="project_ownership"
                      name="project_ownership"
                      value={formData.project_ownership}
                      onChange={(e) =>
                        handleSelectChange("project_ownership", e.target.value)
                      }
                      required={true}
                      options={ownershipOptions.map((ownershipOption) => ({
                        value: ownershipOption.id,
                        label: ownershipOption.name,
                      }))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">MileStone</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setShowMilestoneInput(true);
                        setTimeout(() => inputRef.current?.focus(), 0);
                      }}
                      className="p-2"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </Button>
                    {showMilestoneInput && (
                      <div className="flex items-center gap-2">
                        <Input
                          ref={inputRef}
                          type="text"
                          value={newMilestone}
                          onChange={(e) => setNewMilestone(e.target.value)}
                          placeholder="Enter milestone"
                          className="w-full"
                        />
                        <Button onClick={handleAddMilestone} className="p-2">
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2">
                    {milestones.map((milestone, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md shadow-sm bg-gray-50"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {milestone}
                        </span>
                        <XIcon
                          className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700 transition"
                          onClick={() => handleRemoveMilestone(index)}
                        />
                      </li>
                    ))}
                  </ul>
                  {errors.milestones && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.milestones}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Attachments{" "}
                    <span className="text-xs font-medium text-gray-400">
                      (optional)
                    </span>
                  </h3>
                  <Input
                    key={fileInputKey} // This will reset the input when key changes
                    type="file"
                    multiple
                    id="attachment"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <div className="mt-2 space-y-2">
                    {formData.attachment.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md shadow-sm bg-gray-50"
                      >
                        <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                          {file.name}
                        </span>
                        <XIcon
                          className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700 transition"
                          onClick={() => handleRemoveFile(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dates</h3>
                  <div className="flex flex-col items-center justify-between gap-6">
                    <div className="w-full">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Popover
                        open={isStartDatePopoverOpen}
                        onOpenChange={setIsStartDatePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.start_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.start_date ? (
                              format(new Date(formData.start_date), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              formData.start_date
                                ? new Date(formData.start_date)
                                : undefined
                            }
                            onSelect={(date) => {
                              handleSelectChange(
                                "start_date",
                                date?.toLocaleDateString("en-CA") // Use local date format (YYYY-MM-DD)
                              );
                              setIsStartDatePopoverOpen(false); // Close only the start date popover
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="w-full">
                      <Label htmlFor="end_date">End Date</Label>
                      <Popover
                        open={isEndDatePopoverOpen}
                        onOpenChange={setIsEndDatePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.end_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.end_date ? (
                              format(new Date(formData.end_date), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              formData.end_date
                                ? new Date(formData.end_date)
                                : undefined
                            }
                            onSelect={(date) => {
                              handleSelectChange(
                                "end_date",
                                date?.toLocaleDateString("en-CA") // Use local date format (YYYY-MM-DD)
                              );
                              setIsEndDatePopoverOpen(false); // Close only the end date popover
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="estimated_hours">Estimated Hour</Label>
                    <Input
                      ref={estimatedHoursRef}
                      id="estimated_hours"
                      name="estimated_hours"
                      type="number"
                      value={formData.estimated_hours}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        handleSelectChange("estimated_hours", value);
                      }}
                      onWheel={(e) => e.target.blur()}
                      required
                    />
                    {errors.estimated_hours && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.estimated_hours}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-4 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CreateProject;
