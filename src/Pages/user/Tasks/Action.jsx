/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsThreeDotsVertical } from "react-icons/bs";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import { FaEdit, FaEye } from "react-icons/fa";
import RoleChecker from "@/hooks/RoleChecker";

const Action = ({ task, onEdit, onDelete }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button>
            <BsThreeDotsVertical />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex items-start gap-2">
            <RoleChecker allowedRoles={["team-leader", "manager", "employee"]}>
              <button
                onClick={() => setIsEditDialogOpen(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
            </RoleChecker>
            <RoleChecker allowedRoles={["manager"]}>
              <DeleteTask taskId={task?._id} onDelete={onDelete} />
            </RoleChecker>
            {/* New View Project Button */}
            <RoleChecker allowedRoles={["hr"]}>
              <button
                onClick={() =>
                  (window.location.href = `/project/${task?.projectId}`)
                } // or your routing logic
                className="text-green-500 hover:text-green-700"
              >
                <FaEye />
              </button>
            </RoleChecker>
          </div>
        </PopoverContent>
      </Popover>

      <EditTask
        taskId={task?._id}
        taskData={task}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onEdit={(updatedTask) => {
          console.log("Updated Task from EditTask:", updatedTask);
          onEdit(updatedTask);
          setIsEditDialogOpen(false);
        }}
      />
    </>
  );
};

export default Action;
