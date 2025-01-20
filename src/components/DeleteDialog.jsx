/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const DeleteDialog = ({
  message = "Are you sure you want to delete this item?", // Customizable message
  onConfirm, // Callback function for confirmation
  isLoading, // Loading state
  triggerLabel = "Delete", // Button label for triggering dialog
  className,
}) => {
  const [open, setOpen] = useState(false); // Control popover state

  // Handle confirmation
  const handleConfirm = async () => {
    await onConfirm(); // Execute passed delete function
    setOpen(false); // Close dialog after operation
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="destructive"
          className={`${className} hover:bg-red-600`}
        >
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 space-y-4 relative border border-blue-500">
        <p>{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteDialog;
