/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteTask } from "@/API/admin/task/task_api";

const DeleteTask = ({ taskId, onDelete }) => {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const result = await deleteTask(taskId); // Use the deleteTask API function
        toast.success(result.message || "Task deleted successfully!");
        console.log(result);
        onDelete(taskId); // Notify parent component of the deleted task
      } catch (error) {
        toast.error("Failed to delete task.");
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <button
      className="flex items-center gap-2 text-red-600 hover:text-red-800"
      onClick={handleDelete}
    >
      <FaRegTrashAlt /> Delete
    </button>
  );
};

export default DeleteTask;
