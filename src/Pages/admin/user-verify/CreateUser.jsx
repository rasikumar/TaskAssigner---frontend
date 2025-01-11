import { useState, useRef, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const queryClient = useQueryClient();

  // Fetch last employee ID and generate new ID on component mount

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
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
      setIsOpen(false);
      toast.success("User created successfully!");
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error("Error creating user.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDepartment = async (value) => {
    setFormData((prevData) => ({
      ...prevData,
      department: value, // Set selected department
    }));

    try {
      // Fetch the last ID from the backend for the selected department
      const response = await getLastEmployeeId(value);
      const newId = response.employee_id;
      // console.log(response);

      setFormData((prevData) => ({
        ...prevData,
        employee_id: newId, // Set the generated ID
      }));
    } catch (error) {
      console.error("Error fetching last employee ID:", error);
      toast.error("Failed to generate Employee ID.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Invalid phone number.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      toast.error("Invalid email address.");
      return;
    }
    
    mutation.mutate(formData);
  };

  const startDateRef = useRef(null);
  // const endDateRef = useRef(null);

  // Memoizing form data to avoid unnecessary re-renders
  const memoizedFormData = useMemo(() => formData, [formData]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-fit">
        Create User
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold ">
              Create User
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the details below to create a new User.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 h-[20rem] overflow-scroll"
          >
            <Input
              type="text"
              name="name"
              value={memoizedFormData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <Input
              type="text"
              name="phone"
              value={memoizedFormData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
            />
            <Input
              type="email"
              name="mail"
              value={memoizedFormData.mail}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              name="password"
              value={memoizedFormData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              value={memoizedFormData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />

            <Select
              onValueChange={(value) => handleDepartment(value)}
              value={memoizedFormData.department}
              required
              className="outline-none focus:ring-0 focus:ring-offset-0"
            >
              <SelectTrigger className="outline-none focus:ring-0 focus:ring-offset-0 ">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Departments</SelectLabel>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="human-resource">Human Resource</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
              value={memoizedFormData.role}
              required
            >
              <SelectTrigger className="outline-none focus:ring-0 focus:ring-offset-0 ">
                <SelectValue placeholder="Select a role" />
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

            <Input
              type="text"
              name="employee_id"
              value={memoizedFormData.employee_id}
              readOnly
              placeholder="Employee ID"
            />
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, admin_verify: value })
              }
              value={memoizedFormData.admin_verify}
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

            <div
              className="flex items-center justify-between gap-6"
              onClick={() => startDateRef.current.showPicker()}
            >
              <Input
                ref={startDateRef}
                type="date"
                name="starting_date"
                value={memoizedFormData.starting_date}
                onChange={handleChange}
                placeholder="Starting Date"
                required
              />
            </div>
            {/* <div
              className="flex items-center justify-between gap-6"
              onClick={() => endDateRef.current.showPicker()}
            >
              <Input
                ref={endDateRef}
                type="date"
                name="lastWorking_date"
                value={memoizedFormData.lastWorking_date}
                onChange={handleChange}
                placeholder="Last Working Date"
              />
            </div> */}

            <Button type="submit">Create User</Button>
          </form>
        </DialogContent>

        <ToastContainer />
      </Dialog>
    </>
  );
};

export default CreateUser;
