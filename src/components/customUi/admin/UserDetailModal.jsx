import { FaPen, FaRegWindowClose, FaCopy, FaCheck } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { Input } from "../../ui/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* eslint-disable react/prop-types */
export const UserDetailModal = ({ user, onClose, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user); // Editable fields
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const [successMessage, setSuccessMessage] = useState("");
  // console.log(formData);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!user) return null;

  // Handle outside click
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  // Handle Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleSave = (e) => {
    e.preventDefault();

    // Check if form data is different from the original user data
    if (JSON.stringify(formData) === JSON.stringify(user)) {
      setErrorMessage("No changes were made.");
    } else {
      setErrorMessage(""); // Clear error message
      onEdit(formData); // Submit changes if there are any
    }
  };

  // Function to copy user details to clipboard
  const copyToClipboard = () => {
    const userDetails = `
      Name: ${formData.name}
      Admin Verify: ${formData.admin_verify}
      Department: ${formData.department}
      Role: ${formData.role}
      Employee ID: ${formData.employee_id}
      Email: ${formData.mail}
      Dates: ${formData.starting_date} - ${formData.lastWorking_date}
      Phone: ${formData.phone}
    `;
    navigator.clipboard.writeText(userDetails);

    setSuccessMessage("copied");
    setTimeout(() => setSuccessMessage(""), 2000); // Clear success message after 2 seconds
  };

  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white rounded-lg shadow-lg w-[30rem] p-6 transition-transform duration-300 ease-in-out ${
          isVisible ? "scale-100" : "scale-95"
        } ${isEditing ? "h-[26rem] overflow-scroll" : ""}`}
      >
        <div
          className={`${
            user.admin_verify === "true"
              ? "bg-gradient-to-r from-green-600 to-bg"
              : "bg-gradient-to-r from-red-600 to-bg"
          } -top-10 left-0 w-full h-14 fixed rounded-t-xl flex items-center justify-between px-6 `}
        >
          <h1 className="flex flex-col items-center  text-xl font-semibold">
            User Profile
          </h1>
          <div className="flex gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 transition-colors text-taskBlack bg-slate-50 rounded-3xl px-4"
                  >
                    {successMessage ? (
                      <span className="flex items-center gap-2 transition-all delay-150 text-sm">
                        {successMessage}
                        <FaCheck size={15} />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 transition-all delay-150 text-sm">
                        Copy
                        <FaCopy size={15} />
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>User details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FaPen size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaRegWindowClose size={20} />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4 border-taskBlack pb-2  border-b-2">
          <h2 className="text-3xl font-semibold text-gray-800">
            {isEditing ? (
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 border-b-2 focus:border-primary outline-none"
              />
            ) : (
              user.name
            )}
          </h2>
          <p>
            {isEditing ? (
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, admin_verify: value })
                }
                value={formData.admin_verify}
                required
                className="outline-none focus:ring-0 focus:ring-offset-0"
              >
                <SelectTrigger className="outline-none focus:ring-0 focus:ring-offset-0 ">
                  <SelectValue placeholder="Verify User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Admin Verify</SelectLabel>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              user.admin_verify
            )}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Department</p>
            {isEditing ? (
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
                value={formData.department}
                required
              >
                <SelectTrigger className="p-2 border rounded-md w-full focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Departments</SelectLabel>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="human-resource">
                      Human Resource
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <span className="text-gray-800">{user.department}</span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600">Role</p>
            {isEditing ? (
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                value={formData.role}
                required
              >
                <SelectTrigger className="p-2 border rounded-md w-full focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="member">Member</SelectItem>
                    {/* <SelectItem value="employee">Senior</SelectItem> */}
                    {/* <SelectItem value="hr">HR</SelectItem> */}
                    <SelectItem value="team lead">Team Leader</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    {/* <SelectItem value="tester">Tester</SelectItem> */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <span className="text-gray-800">{user.role}</span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600">Employee ID</p>
            {isEditing ? (
              <Input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="p-2 border rounded-md w-full focus:ring-2 focus:ring-primary"
              />
            ) : (
              <span className="text-gray-800">{user.employee_id}</span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600">Email</p>
            {isEditing ? (
              <Input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className="p-2 border rounded-md w-full focus:ring-2 focus:ring-primary"
              />
            ) : (
              <span className="text-gray-800">{user.mail}</span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600">Dates</p>
            {isEditing ? (
              <>
                <div
                  className="flex items-center justify-between gap-6 mb-2"
                  onClick={() => startDateRef.current.showPicker()}
                >
                  <Input
                    ref={startDateRef}
                    type="date"
                    name="starting_date"
                    value={formData.starting_date}
                    onChange={handleChange}
                  />
                </div>
                <div
                  className="flex items-center justify-between gap-6 mb-2"
                  onClick={() => endDateRef.current.showPicker()}
                >
                  <Input
                    ref={endDateRef}
                    type="date"
                    name="lastWorking_date"
                    value={formData.lastWorking_date}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <span className="text-gray-800">
                {user.starting_date} - {user.lastWorking_date}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600">Phone</p>
            {isEditing ? (
              <Input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-2 border rounded-md w-full focus:ring-2 focus:ring-primary"
              />
            ) : (
              <span className="text-gray-800">{user.phone}</span>
            )}
          </div>
        </div>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="mt-2 text-green-500 hover:text-green-700 transition-colors"
          >
            <Button>Update Profile</Button>
          </button>
        ) : (
          ""
        )}
        {errorMessage && (
          <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};
