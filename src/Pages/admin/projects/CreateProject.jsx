import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/API/admin/projects/project_api";
import { adminDashboard } from "@/API/admin/adminDashborad";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
    project_ownership: "", // Initially empty, will be set when user data is fetched
    project_status: "Not Started",
    start_date: "",
    end_date: "",
    estimated_hours: "",
  });

  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

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
      });
      setIsOpen(false);
      toast.success("Project Created Successfully");
    },
    onError: (err) => {
      toast.error("Failed to create project. Please try again.");
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
    queryFn: adminDashboard,
    enabled: isOpen, // Only fetch when the dialog is open
  });

  // console.log(userData.data.role);

  useEffect(() => {
    if (userData) {
      setFormData((prevData) => ({
        ...prevData,
        project_ownership: userData.data.role || "",
      }));
    }
  }, [userData]);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutations.mutate(formData);
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Set project ownership once user data is available

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
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={(e) =>
                    handleSelectChange("project_name", e.target.value)
                  }
                  required
                  placeholder="Enter project title"
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
                  readOnly={formData.project_ownership !== ""}
                  className="cursor-not-allowed"
                />
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
                    placeholder="Start date"
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
                <Label htmlFor="estimated_hours">Estimated Hour</Label>
                <Input
                  id="estimated_hours"
                  name="estimated_hours"
                  type="input"
                  value={formData.estimated_hours}
                  onChange={(e) =>
                    handleSelectChange("estimated_hours", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default CreateProject;
