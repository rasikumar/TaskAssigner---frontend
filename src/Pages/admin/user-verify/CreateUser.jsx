import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  getLastEmployeeId,
} from "@/API/admin/userverify/userVerify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { selectItemsData } from "@/utils/selectDepartment";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import Modal from "@/components/customUi/Modal";

const CreateUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    mail: "",
    password: "",
    confirmPassword: "",
    role: "",
    admin_verify: "",
    employee_id: "",
    department: "",
    starting_date: "",
    lastWorking_date: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      resetForm();
      setIsOpen(false);
      toast.success("User created successfully!");
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error(error.message || "Error creating user. Please try again.");
    },
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      mail: "",
      password: "",
      confirmPassword: "",
      role: "",
      admin_verify: "",
      employee_id: "",
      department: "",
      starting_date: "",
      lastWorking_date: "",
    });
    setErrors({});
    setSubmitAttempted(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (!/^[a-zA-Z ]+$/.test(value)) {
          error = "Name must contain only letters and spaces";
        }
        break;
      case "phone":
        if (!value) {
          error = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = "Phone must be exactly 10 digits";
        } else if (/^0+$/.test(value)) {
          error = "Phone cannot be all zeros";
        }
        break;
      case "mail":
        if (!value) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      case "department":
        if (!value) error = "Department is required";
        break;
      case "role":
        if (!value) error = "Role is required";
        break;
      case "admin_verify":
        if (!value) error = "Verification status is required";
        break;
      case "starting_date":
        if (!value) error = "Starting date is required";
        break;
      default:
        break;
    }

    setErrors({ ...errors, [field]: error });
    return !error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field if submit was attempted
    if (submitAttempted) {
      validateField(name, value);
    }
  };

  const handleDepartment = async (value) => {
    setFormData((prevData) => ({
      ...prevData,
      department: value,
      employee_id: "", // Clear employee ID while loading new one
    }));

    // Validate department if submit was attempted
    if (submitAttempted) {
      validateField("department", value);
    }

    try {
      const response = await getLastEmployeeId(value);
      const newId = response.employee_id;

      setFormData((prevData) => ({
        ...prevData,
        employee_id: newId,
      }));
    } catch (error) {
      console.error("Error fetching last employee ID:", error);
      toast.error("Failed to generate Employee ID.");
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      if (field !== "lastWorking_date" && field !== "employee_id") {
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
      }
    });

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-fit">
        Create User
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={
                  errors.name && submitAttempted ? "border-red-500" : ""
                }
              />
              {errors.name && submitAttempted && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                  setFormData({ ...formData, phone: value });
                  if (submitAttempted) validateField("phone", value);
                }}
                placeholder="9876543210"
                maxLength={10}
                className={
                  errors.phone && submitAttempted ? "border-red-500" : ""
                }
              />
              {errors.phone && submitAttempted && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mail">Email Address *</Label>
            <Input
              id="mail"
              name="mail"
              type="email"
              value={formData.mail}
              onChange={handleChange}
              placeholder="john@example.com"
              className={errors.mail && submitAttempted ? "border-red-500" : ""}
            />
            {errors.mail && submitAttempted && (
              <p className="text-sm text-red-500">{errors.mail}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  className={
                    errors.password && submitAttempted ? "border-red-500" : ""
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {errors.password && submitAttempted && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••"
                  className={
                    errors.confirmPassword && submitAttempted
                      ? "border-red-500"
                      : ""
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {errors.confirmPassword && submitAttempted && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starting_date">Starting Date *</Label>
              <DatePicker
                selectedDate={formData.starting_date}
                onChange={(date) => {
                  setFormData({ ...formData, starting_date: date });
                  if (submitAttempted) validateField("starting_date", date);
                }}
                placeholder="Start Date"
                className={
                  errors.starting_date && submitAttempted
                    ? "border-red-500"
                    : ""
                }
              />
              {errors.starting_date && submitAttempted && (
                <p className="text-sm text-red-500">{errors.starting_date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                onValueChange={handleDepartment}
                value={formData.department}
              >
                <SelectTrigger
                  className={
                    errors.department && submitAttempted ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Departments</SelectLabel>
                    {selectItemsData.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.department && submitAttempted && (
                <p className="text-sm text-red-500">{errors.department}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, role: value });
                  if (submitAttempted) validateField("role", value);
                }}
                value={formData.role}
              >
                <SelectTrigger
                  className={
                    errors.role && submitAttempted ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="team lead">Team Leader</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.role && submitAttempted && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input
                value={formData.employee_id}
                readOnly
                placeholder="Auto-generated"
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Admin Verification *</Label>
            <Select
              onValueChange={(value) => {
                setFormData({ ...formData, admin_verify: value });
                if (submitAttempted) validateField("admin_verify", value);
              }}
              value={formData.admin_verify}
            >
              <SelectTrigger
                className={
                  errors.admin_verify && submitAttempted ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Verify user" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Verification Status</SelectLabel>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Not Verified</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.admin_verify && submitAttempted && (
              <p className="text-sm text-red-500">{errors.admin_verify}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={mutation.isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>

        <ToastContainer />
      </Modal>
    </>
  );
};

export default CreateUser;
