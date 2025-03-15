/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import { FaPen, FaRedo, FaRegWindowClose } from "react-icons/fa";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CirclesWithBar } from "react-loader-spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { getAllEmployeeOwnerShip } from "@/API/admin/adminDashborad";
import Selector from "../Selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetProjectView } from "@/API/admin/projects/project_api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ProjectDetailModal = ({ project, onClose, onEdit, taskList }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(project);
  const [errorMessage, setErrorMessage] = useState("");
  // const [isOpen] = useState(false);
  const [ownershipOptions, setOwnershipOptions] = useState([]);
  const [milestoneData, setMilestoneData] = useState(project.milestones || []);

  // console.log(formData);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const EndDate = useRef(null);
  const StartDate = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setFormData(project);
    setMilestoneData(project.milestones || []);
  }, [project]);

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getAllEmployeeOwnerShip,
  });

  const mutateDocumentId = useMutation({
    mutationFn: GetProjectView,
    // onSuccess: (data) => {
    //   // Update the document in the database
    //   console.log(data);
    //   // setIsEditing(false);
    //   // onClose();
    // },
    onError: (error) => {
      console.error("Error Viewing document:", error);
      setErrorMessage("Error Viewing document. Please try again later.");
    },
  });

  // console.log(userData);
  useEffect(() => {
    if (userData) {
      const options = [
        // ...userData.teamLeads
        //   .filter((lead) => lead.admin_verify === "true") // Check admin_verify for team leads
        //   .map((lead) => ({
        //     id: lead.id,
        //     name: `Team Lead - ${lead.name}`,
        //   })),

        ...userData.managers
          .filter(
            (manager) =>
              manager.admin_verify === true && manager.hr_approval === true
          ) // Check admin_verify for managers
          .map((manager) => ({
            id: manager.id,
            name: `Manager - ${manager.name}`,
          })),
      ];
      setOwnershipOptions(options);
    }
  }, [userData]);

  // console.log(ownershipOptions);

  if (isLoading) {
    return <CirclesWithBar />;
  }
  if (isError) {
    console.error("Error fetching user data:", error);
    return null;
  }

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

    const updatedFormData = { ...formData, milestones: milestoneData };

    setErrorMessage(""); // Clear error message
    onEdit(updatedFormData); // Submit changes including milestones
    // console.log(updatedFormData);
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...milestoneData];
    // console.log(updatedMilestones);
    updatedMilestones[index][field] = value;
    setMilestoneData(updatedMilestones);
  };

  const handleMilestoneDelete = (index) => {
    const updatedMilestones = milestoneData.filter((_, i) => i !== index);
    setMilestoneData(updatedMilestones);
  };

  const handleMilestoneAdd = () => {
    const newMilestone = {
      name: "",
      status: "Not Started",
    };
    setMilestoneData([...milestoneData, newMilestone]);
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

  const statusOptions = [
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    // { value: "Cancelled", label: "Cancelled" },
  ];

  const handleDocumentClick = (documentId) => {
    // console.log(documentId);
    mutateDocumentId.mutate(documentId, {
      onSuccess: (file) => {
        if (file) {
          const blob = new Blob([file], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setIsOpen(true); // Open modal
        }
      },
    });
  };
  // console.log("dd", taskList);

  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white absolute right-4 bottom-4 overflow-scroll 2xl:w-[30rem] w-[25rem] h-[85%] rounded-sm shadow-lg transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-gradient-to-r from-taskBlack to-bg text-white h-14 flex items-center justify-between px-6 rounded-t-sm sticky top-0 z-50">
          <h1 className="2xl:text-xl text-sm font-semibold">
            Project Overview
          </h1>
          <div className="flex gap-x-2">
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
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaRegWindowClose size={20} />
            </button>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="mt-6 h-96 px-4 ">
          {isEditing ? (
            <>
              <h3 className="block text-sm font-semibold text-gray-700">
                Ownership
              </h3>
              <Select
                id="project_ownership"
                name="project_ownership"
                value={formData.project_ownership._id}
                onValueChange={(value) => {
                  const selectedOwnership = ownershipOptions.find(
                    (option) => option.id === value
                  );
                  if (selectedOwnership) {
                    console.log("Selected Ownership:", selectedOwnership); // Debugging log
                    setFormData({
                      ...formData,
                      project_ownership: selectedOwnership,
                    });
                    console.log("Updated formData:", formData); // Debugging log
                  }
                }}
                required
                className="w-full p-2 border rounded-md"
              >
                <SelectTrigger className="outline-none focus:ring-0 focus:ring-offset-0 ">
                  <SelectValue placeholder="Select project ownership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select a Ownership</SelectLabel>
                    {ownershipOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {renderInput(
                "project_name",
                "Project Name",
                formData.project_name
              )}
              {/* {renderInput(
                "project_description",
                "Project Description",
                formData.project_description
              )} */}
              <Textarea
                value={formData.project_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_description: e.target.value,
                  })
                }
              />

              <Selector
                id="project_status"
                label="project_status"
                value={formData.project_status}
                onChange={(e) =>
                  setFormData({ ...formData, project_status: e.target.value })
                }
                options={statusOptions}
              />

              {renderInput(
                "estimated_hours",
                "Estimated Hours",
                formData.estimated_hours
              )}

              <div className="mb-4">
                Start Date
                <Input
                  onClick={() => StartDate.current.showPicker()}
                  ref={StartDate}
                  id="StartDate"
                  name="StartDate"
                  type="date"
                  value={
                    formData.startDate ? formData.startDate.split("T")[0] : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                End Date
                <Input
                  onClick={() => EndDate.current.showPicker()}
                  ref={EndDate}
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate ? formData.endDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Milestones
                </h2>

                {milestoneData.map((milestone, index) => (
                  <div key={milestone._id} className="mb-2 flex gap-2">
                    <Input
                      type="text"
                      value={milestone.name}
                      onChange={(e) =>
                        handleMilestoneChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 border-b-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Select
                      value={milestone.status}
                      onValueChange={(value) =>
                        handleMilestoneChange(index, "status", value)
                      }
                      className="w-full p-2 border rounded-md mt-2"
                    >
                      <SelectTrigger className="outline-none focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select a Status</SelectLabel>
                          <SelectItem value="Not Started">
                            Not Started
                          </SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => handleMilestoneDelete(index)}>
                      Delete
                    </Button>
                  </div>
                ))}
                <Button onClick={handleMilestoneAdd} className="mb-2">
                  Add
                </Button>
              </div>

              <Button onClick={handleSave} className="mb-4">
                Update Project
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-taskBlack text-xl font-semibold">
                  {project.project_ownership.name}
                </h2>
                <button
                  onClick={() =>
                    handleDocumentClick(project?.attachments?.file_url)
                  }
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm cursor-pointer"
                >
                  {project?.attachments?.file_name || ""}
                </button>
              </div>
              <h1 className="text-taskBlack text-lg font-semibold">
                {project.project_name}
              </h1>
              <hr className="bg-taskBlack h-[0.1rem] border-0" />
              <p className="text-taskBlack text-sm ">
                {project.project_description}
              </p>
              <div>
                <div className="flex flex-col gap-2 my-4 border p-2 rounded-lg border-blue-300 shadow-minimal">
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
                    Start Date{" "}
                    <span className="text-black">
                      {new Date(project.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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
                </div>
                <Tabs defaultValue="milestones">
                  <TabsList className="grid w-full grid-cols-2 bg-bg">
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  </TabsList>
                  <TabsContent value="milestones">
                    <div className="mt-4">
                      <div className="space-y-4">
                        {project.milestones.map((milestone) => (
                          <div
                            key={milestone._id}
                            className="flex items-center justify-between p-3 border rounded-lg  bg-white"
                          >
                            <div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                {milestone.name}
                              </h3>
                            </div>
                            <div>
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  milestone.status === "Completed"
                                    ? "bg-green-100 text-green-600"
                                    : milestone.status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {milestone.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="tasks">
                    <div className="mt-4">
                      {taskList && taskList.length > 0 ? (
                        <ul className="space-y-3">
                          {taskList.map((task) => (
                            <li
                              key={task._id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                            >
                              <div className="flex flex-col gap-1">
                                <h3 className="text-sm font-semibold text-gray-800">
                                  {task.task_title}
                                </h3>
                                {/* <p className="text-sm text-gray-500">
                                  {task.task_description}
                                </p> */}
                              </div>
                              <span
                                className={`mt-2 sm:mt-0 inline-block text-xs font-medium px-3 py-1 rounded-full ${
                                  task.status === "Completed"
                                    ? "bg-green-100 text-green-600"
                                    : task.status === "In-Progress"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {task.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No tasks available.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>View Document</DialogTitle>
            </DialogHeader>
            {pdfUrl && (
              <embed
                src={pdfUrl}
                type="application/pdf"
                className="w-full h-[500px] border rounded-md"
              />
            )}
          </DialogContent>
        </Dialog>
        {errorMessage && (
          <div className="mt-4 text-red-500 text-sm text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};
