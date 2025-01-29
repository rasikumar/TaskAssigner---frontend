/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  Circle,
  ClipboardList,
  FileText,
  Flag,
  Ticket,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaPen, FaRedo, FaRegWindowClose } from "react-icons/fa";

const TicketDetailModal = ({ onClose, ticket, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(ticket);
  console.log(formData);

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    onEdit(formData);
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
        <TooltipProvider>
          <Card className="w-full max-w-lg mx-auto p-4 shadow-lg border rounded-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-800">
                {ticket?.project?.project_name || "No Project"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Documents Section */}
              {ticket?.attachments?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Documents
                  </h3>
                  <div className="flex flex-col gap-2">
                    {ticket?.attachments.map((doc, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline text-sm cursor-pointer"
                          >
                            <FileText className="h-4 w-4 text-gray-600" />
                            {doc.name || `Document ${index + 1}`}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>Click to view document</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}

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
                  <p className="text-gray-600 text-sm">{ticket?.description}</p>
                  <TooltipContent>Ticket Title & Description</TooltipContent>
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
                      className={`px-3 py-1 flex items-center rounded-xl text-sm ${
                        ticket?.priority === "High"
                          ? "bg-red-500 text-white"
                          : ticket?.priority === "Medium"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
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
                      className={`px-3 py-1 flex items-center rounded-xl text-sm ${
                        ticket?.status === "Open"
                          ? "bg-blue-500 text-white"
                          : ticket?.status === "In Progress"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      <Circle className="h-4 w-4 mr-1" />
                      {ticket?.status || "No Status"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Ticket Status</TooltipContent>
                </Tooltip>
              </div>

              {/* Created At */}
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(ticket?.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) || "Unknown Date"}
              </div>
            </CardContent>
          </Card>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TicketDetailModal;
