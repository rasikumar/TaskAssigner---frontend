/* eslint-disable react/prop-types */
import { deleteUser } from "@/API/admin/userverify/userVerify";
import { toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";

const UserDelete = ({ userId, onDelete }) => {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this User?")) {
      try {
        const result = await deleteUser(userId); // Use the deleteUser API function
        console.log(result);
        if (result.status === "true") {
          onDelete(userId);
        } else {
          toast.error(result.message || "Failed to delete User.");
        }
      } catch (error) {
        toast.error("Failed to delete User.");
        console.error("Error deleting User:", error);
      }
    }
  };

  return (
    <button
      className="flex items-center gap-2 text-red-600 hover:text-red-800"
      onClick={handleDelete}
    >
      <FaRegTrashAlt />
    </button>
  );
};

export default UserDelete;
