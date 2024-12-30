import { useState, useEffect, useRef } from "react";
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
    admin_verify: "true",
    employee_id: "",
    department: "",
    starting_date: "",
    lastWorking_date: "",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchLastEmployeeId = async () => {
      try {
        const lastEmployeeId = await getLastEmployeeId();
        const newEmployeeId = `EVS${String(
          parseInt(lastEmployeeId.slice(3)) + 1
        ).padStart(6, "0")}`;
        setFormData((prevFormData) => ({
          ...prevFormData,
          employee_id: newEmployeeId,
        }));
      } catch (error) {
        console.error("Error fetching last employee ID:", error);
      }
    };

    fetchLastEmployeeId();
  }, []);

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      const newEmployeeId = `EVS${String(
        parseInt(formData.employee_id.slice(3)) + 1
      ).padStart(6, "0")}`;
      setFormData({
        name: "",
        phone: "",
        mail: "",
        password: "",
        confirmPassword: "",
        role: "",
        admin_verify: "true",
        employee_id: newEmployeeId,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  
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
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
            />
            <Input
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />

            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              } // Handle change correctly
              value={formData.role}
              required
            >
              <SelectTrigger className="outline-none focus:ring-0 focus:ring-offset-0 ">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="team leader">Team Leader</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="tester">Tester</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
              }
              value={formData.department}
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
                  <SelectItem value="humanresource">Human Resource</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              readOnly // Make the field read-only
            />

            <Input
              type="text"
              name="admin_verify"
              value={formData.admin_verify}
              onChange={handleChange}
              placeholder="Admin Verify"
              required
            />

            <div
              className="flex items-center justify-between gap-6"
              onClick={() => startDateRef.current.showPicker()}
            >
              <Input
                ref={startDateRef}
                type="date"
                name="starting_date"
                value={formData.starting_date}
                onChange={handleChange}
                placeholder="Starting Date"
                required
              />
            </div>
            <div
              className="flex items-center justify-between gap-6"
              onClick={() => endDateRef.current.showPicker()}
            >
              <Input
                ref={endDateRef}
                type="date"
                name="lastWorking_date"
                value={formData.lastWorking_date}
                onChange={handleChange}
                placeholder="Last Working Date"
              />
            </div>

            <Button type="submit">Create User</Button>
          </form>
        </DialogContent>

        <ToastContainer />
      </Dialog>
    </>
  );
};

export default CreateUser;
