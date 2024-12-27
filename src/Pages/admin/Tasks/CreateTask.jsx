import { useState, useRef } from "react";
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
import { Label } from "../../../components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import Instance from "@/API/Instance";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    project_title: "",
    project_description: "",
    project_ownership: "",
    status: "Not started",
    priority: "Low",
    start_date: "",
    end_date: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  // Refs for date inputs
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

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
            <DialogTitle className="text-xl font-bold">
              Create Project
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the details below to create a new Project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div>
                <Input
                  id="project_title"
                  name="project_title"
                  value={formData.project_title}
                  onChange={(e) =>
                    handleSelectChange("project_title", e.target.value)
                  }
                  required
                  placeholder="Enter project title"
                  className=""
                />
              </div>
              <div>
                <Textarea
                  id="project_description"
                  name="project_description"
                  value={formData.project_description}
                  onChange={(e) =>
                    handleSelectChange("project_description", e.target.value)
                  }
                  required
                  placeholder="Enter project description"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assignment</h3>
              <div>
                <Input
                  id="project_ownership"
                  name="project_ownership"
                  value={formData.project_ownership}
                  onChange={(e) =>
                    handleSelectChange("project_ownership", e.target.value)
                  }
                  required
                  placeholder="Enter project ownership"
                />
                <div></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dates</h3>
              <div className="flex items-center justify-between gap-6">
                <div
                  className="w-full cursor-pointer"
                  onClick={() => startDateRef.current.showPicker()}
                >
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    ref={startDateRef}
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
                <div
                  className="w-full cursor-pointer"
                  onClick={() => endDateRef.current.showPicker()}
                >
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    ref={endDateRef}
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

              <div>
                <Label htmlFor="estimated_hour">Estimated Hour</Label>
                <Input
                  id="estimated_hour"
                  name="estimated_hour"
                  type="input"
                  value={formData.estimated_hour}
                  onChange={(e) =>
                    handleSelectChange("estimated_hour", e.target.value)
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
