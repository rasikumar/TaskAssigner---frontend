/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getEmpMails } from "@/API/user/userVerify/userVerfiy";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Combobox } from "../Handle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getpriority } from "@/utils/prorityUtils";
import { getStatus } from "@/utils/statusUtils";

import {
  Calendar,
  Circle,
  ClipboardList,
  FileText,
  Flag,
  Ticket,
  User,
} from "lucide-react";
import { FaPen, FaRedo, FaRegWindowClose } from "react-icons/fa";
import Selector from "../Selector";
import { priorityOptions } from "@/utils/prorityOptions";
import { severityOptions } from "@/utils/severityOptions";
import { getSeverity } from "@/utils/severityUtils";
import { statusoptionforTicket } from "@/utils/statusOptionsforTicket";
import {
  mainCategoryOptions,
  subCategoryMapping,
} from "@/utils/categoriesOptions";
import { VscLoading } from "react-icons/vsc";
import { Label } from "@/components/ui/label";
import RoleChecker from "@/lib/RoleChecker";
import TicketHook from "@/hooks/ticket/TicketHook";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserTicketDetailModal = ({ onClose, ticket, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(ticket);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [status, setStatus] = useState(formData?.status);
  const [showTextarea, setShowTextarea] = useState(false);
  const [description, setDescription] = useState(""); // Store textarea input

  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // console.log(formData);

  const attachmentsArray = Array.isArray(formData?.attachments)
    ? formData.attachments
    : [formData?.attachments]; // Convert single object to array

  const { updateTicketStatus, getDocumentById } = TicketHook();

  const {
    isError: isUserListError,
    isLoading: isUserListLoading,
    error: UserListError,
    data: userList = [],
  } = useQuery({
    queryKey: ["userList"],
    queryFn: getEmpMails,
  });

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  useEffect(() => {
    if (formData?.status) {
      setStatus(formData.status);
    }
  }, [formData]); // Update status whenever formData changes
  
  const handleStatusChange = (_id, value) => {
    setStatus(value);

    if (value === "Resolved") {
      setShowTextarea(true); // Show textarea for description input
    } else {
      updateTicketStatus.mutate(
        { _id, status: value },
        {
          onSuccess: () => {
            setIsEditing(false);
            setIsVisible(false);
          },
        }
      );
    }
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert("Please enter a description before submitting.");
      return;
    }

    updateTicketStatus.mutate(
      { _id: formData._id, status: "Resolved", description },
      {
        onSuccess: () => {
          setIsEditing(false);
          setIsVisible(false);
          setShowTextarea(false);
          setDescription(""); // Clear the textarea
        },
      }
    );
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

    if (name === "main_category") {
      const subOptions = subCategoryMapping[value] || [];
      setSubCategoryOptions(subOptions);
      setFormData((prevData) => ({
        ...prevData,
        sub_category: "", // Reset subCategory when mainCategory changes
      }));
    }
  };

  const handleDocumentEdit = (index, file) => {
    if (!file) return;

    setFormData((prevData) => {
      const newAttachment = {
        file_name: file.name,
      };

      // Ensure attachments is always an array
      const updatedAttachments = Array.isArray(prevData.attachments)
        ? [...prevData.attachments]
        : [];

      // If replacing an existing file
      if (updatedAttachments[index]) {
        updatedAttachments[index] = newAttachment;
      } else {
        updatedAttachments.push(newAttachment);
      }

      return {
        ...prevData,
        attachments: updatedAttachments,
      };
    });
  };

  const handleDocumentClick = (fileUrl) => {
    // console.log(fileUrl);
    getDocumentById.mutate(fileUrl, {
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
  // console.log(pdfUrl);

  const handleSave = (e) => {
    e.preventDefault();
    onEdit(formData);
    setIsEditing(false);
    setIsVisible(false);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setFormData(ticket);
  }, [ticket]);

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
          <h1 className="text-lg font-semibold">Ticket Overview</h1>
          <div className="flex gap-x-4">
            <RoleChecker
              allowedRoles={["member", "team lead", "manager"]}
              allowedDepartments={["testing"]}
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
        {isEditing ? (
          <div className="w-full max-w-lg mx-auto border rounded-lg bg-white p-4 flex flex-col gap-y-4">
            {renderInput("title", "title", formData.title)}
            {renderInput("description", "description", formData.description)}

            {isUserListError ? (
              <div>{UserListError.response.data.message}</div>
            ) : isUserListLoading ? (
              <p className="animate-spin fixed">
                <VscLoading />
              </p>
            ) : (
              <>
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
              </>
            )}
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
              required
            />
            <Selector
              label="Status"
              id="status"
              value={formData.status}
              onChange={(e) => handleSelectChange("status", e.target.value)}
              options={statusoptionforTicket}
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
              label="Priority"
              id="priority"
              value={formData.priority}
              onChange={(e) => handleSelectChange("priority", e.target.value)}
              options={priorityOptions}
              required
            />

            <div className="flex flex-col">
              <Label htmlFor="attachments">Attachments:</Label>
              {/* {formData?.attachments &&
                formData?.attachments.length > 0 &&
                formData?.attachments.map((doc, index) =>
                  renderDocumentEdit(doc, index)
                )}

              <Input
                type="file"
                multiple
                id="attachments"
                onChange={handleFileChange}
              /> */}
              {/* {formData?.attachments.length > 0 ? ( */}
              {attachmentsArray.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  {/* Display File Name Inside Input Field */}
                  <input
                    type="text"
                    value={doc?.file_name || `Document ${index + 1}`}
                    className="border p-2 text-sm w-full"
                    readOnly
                  />

                  {/* Hidden File Input for Upload */}
                  <Input
                    type="file"
                    onChange={(e) =>
                      handleDocumentEdit(index, e.target.files[0])
                    }
                    className="hidden"
                    id={`file-input-${index}`}
                  />

                  {/* Label to Trigger File Selection */}
                  <label
                    htmlFor={`file-input-${index}`}
                    className="bg-gray-200 px-3 py-1 rounded cursor-pointer text-sm"
                  >
                    Upload
                  </label>

                  {/* File Download Link */}
                  {/* <a
                    href={doc?.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm cursor-pointer"
                  >
                    View
                  </a> */}

                  {/* Remove Button */}
                  {/* <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveDocument(index)}
                  >
                    Remove
                  </Button> */}
                </div>
              ))}

              {/* ))
              ) : (
                <p className="text-gray-500">No attachments added.</p>
              )} */}
            </div>
            <Button onClick={handleSave} className="mb-4">
              Update Ticket
            </Button>
          </div>
        ) : (
          <>
            {/* Content */}
            <TooltipProvider>
              <Card className="w-full max-w-lg mx-auto border rounded-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-800">
                    {ticket?.project?.project_name || "No Project"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Documents Section */}
                  <div className="space-x-2 flex items-center justify-between">
                    {[ticket?.attachments].flat().map((doc, index) => (
                      <Tooltip key={doc?._id || index}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleDocumentClick(doc?.file_url)}
                            className="flex items-center gap-2 text-blue-600 hover:underline text-sm cursor-pointer"
                          >
                            <FileText className="h-4 w-4 text-gray-600" />
                            {doc?.file_name || "Document"}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Click to view document</TooltipContent>
                      </Tooltip>
                    ))}

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(ticket?.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      ) || "Unknown Date"}
                    </div>
                  </div>
                  {/* Assigned & Raised Info */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-100 p-3 rounded-md">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700 font-medium">
                            {ticket?.assigned_to?.name || "Unassigned"}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Assigned To</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700 font-medium">
                            {ticket?.raised_by?.name || "Unknown"}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Raised By</TooltipContent>
                    </Tooltip>
                  </div>
                  <Separator />
                  {/* Ticket Details */}
                  <div className="space-y-2 border px-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 cursor-pointer">
                          <Ticket className="h-5 w-5 text-blue-500" />
                          {ticket?.title || "No Title"}
                        </h3>
                      </TooltipTrigger>
                      <p className="text-gray-600 text-sm">
                        {ticket?.description}
                      </p>
                      <TooltipContent>
                        Ticket Title & Description
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {/* Task Details */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <ClipboardList className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {ticket?.tasks?.task_title || "No Task"}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Task Title</TooltipContent>
                  </Tooltip>
                  {/* Category */}
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {ticket?.main_category || "No Category"}
                    </Badge>
                    <Badge variant="outline">
                      {ticket?.sub_category || "No Subcategory"}
                    </Badge>
                  </div>
                  {/* Priority & Status */}
                  <div className="flex items-center justify-between">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`px-3 py-1 flex items-center rounded-xl text-sm ${getpriority(
                            ticket?.priority
                          )}`}
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          {ticket?.priority || "No Priority"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Ticket Priority</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`px-3 py-1 flex items-center rounded-xl text-sm ${getSeverity(
                            ticket?.severity
                          )}`}
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          {ticket?.severity || "No severity"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Ticket severity</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`px-3 py-1 flex items-center rounded-xl text-sm ${getStatus(
                            ticket?.status
                          )}`}
                        >
                          <Circle className="h-4 w-4 mr-1" />
                          {ticket?.status || "No Status"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Ticket Status</TooltipContent>
                    </Tooltip>
                  </div>
                  <RoleChecker
                    allowedDepartments={["development"]}
                    allowedRoles={["member", "team lead", "manager"]}
                  >
                    <Selector
                      label="Status"
                      id="status"
                      value={status}
                      onChange={(e) =>
                        handleStatusChange(formData._id, e.target.value)
                      }
                      options={statusoptionforTicket}
                      required
                    />

                    {showTextarea && (
                      <div>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter resolution details..."
                          required
                        />
                        <button
                          onClick={handleSubmit}
                          className="mt-2 bg-blue-500 text-white p-2 rounded"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </RoleChecker>
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
                  {/* Created At */}
                </CardContent>
              </Card>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
};

export default UserTicketDetailModal;
