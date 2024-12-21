import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import Instance from "@/API/Instance";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    project_title: "",
    project_description: "",
    project_ownership: "",
    assigned_to: "",
    report_to: "",
    status: "Not started",
    priority: "Low",
    start_date: "",
    end_date: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Instance.post("/admin/createTask", formData);
      if (response.data.status === "Success") {
        toast.success(response.data.message);
        setIsOpen(false);
      } else if (response.data.status === "failure") {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create New Project</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-6 max-w-lg text-taskBlack bg-bg h-96 overflow-scroll">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create Project</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the details below to create a new Project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div>
                <Label htmlFor="project_title">Project Title</Label>
                <Input
                  id="project_title"
                  name="project_title"
                  value={formData.project_title}
                  onChange={(e) =>
                    handleSelectChange("project_title", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="project_description">Project Description</Label>
                <Textarea
                  id="project_description"
                  name="project_description"
                  value={formData.project_description}
                  onChange={(e) =>
                    handleSelectChange("project_description", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Priority Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Priority</h3>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Very High</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Regular">Normal</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assignment</h3>
              <div>
                <Label htmlFor="project_ownership">Project Ownership</Label>
                <Input
                  id="project_ownership"
                  name="project_ownership"
                  value={formData.project_ownership}
                  onChange={(e) =>
                    handleSelectChange("project_ownership", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Input
                  id="assigned_to"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) =>
                    handleSelectChange("assigned_to", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="report_to">Report To</Label>
                <Input
                  id="report_to"
                  name="report_to"
                  value={formData.report_to}
                  onChange={(e) =>
                    handleSelectChange("report_to", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Dates Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dates</h3>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    handleSelectChange("start_date", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    handleSelectChange("end_date", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="mt-4 w-full">
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default CreateTask;
