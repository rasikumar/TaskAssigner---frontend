/* eslint-disable react/prop-types */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const DeleteUser = ({ onConfirm, isLoading }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Delete</Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 space-y-4">
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteUser;
