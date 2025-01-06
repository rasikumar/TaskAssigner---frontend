import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

const CreateTask = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    task_title: "",
    task_description: "",
    assigned_to: "",
    assigned_by: "",
    report_to: "",
    status: "Not Started",
    priority: "",
    start_date: "",
    end_date: "",
  });

  const handleSumbit = (e) => {
    e.preventDefault();
    // TODO: Add form validation and API call to create task
    setIsOpen(false);
  };

  //   const startDateRef = useRef(null);
  //   const endDateRef = useRef(null);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-fit">
        Create Task
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-6 max-w-lg text-taskBlack bg-bg h-96 overflow-scroll">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create Task</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the details below to create a new Task.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={() => handleSumbit} className="space-y-6">
            <Input
              id="project_name"
              name="project_name"
              value={formData.task_title}
              onChange={(e) =>
                handleSelectChange("project_name", e.target.value)
              }
              required
              placeholder="Enter project title"
            />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTask;
