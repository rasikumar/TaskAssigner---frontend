/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const EditTask = ({ taskId, taskData, isOpen, onClose, onEdit }) => {
  const [editedTask, setEditedTask] = useState(taskData || {});

  useEffect(() => {
    setEditedTask(taskData); 
  }, [taskData]);

  const handleSave = () => {
    const updatedTask = {
      id: taskId,
      title: editedTask.project_title,
      description: editedTask.project_description,
    };

    console.log("Sending updatedTask to onEdit:", updatedTask);
    onEdit(updatedTask);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            type="text"
            value={editedTask.project_title || ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, project_title: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Task Name"
          />
          <textarea
            value={editedTask.project_description || ""}
            onChange={(e) =>
              setEditedTask({
                ...editedTask,
                project_description: e.target.value,
              })
            }
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="Task Description"
          />
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
