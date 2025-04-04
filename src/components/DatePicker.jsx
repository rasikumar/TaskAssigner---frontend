/* eslint-disable react/prop-types */
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const DatePicker = ({ selectedDate, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "font-normal text-sm text-left justify-start",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {selectedDate ? (
            format(new Date(selectedDate), "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" disableAutoFocus>
        <Calendar
          mode="single"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onSelect={(date) => {
            onChange(date ? format(date, 'yyyy-MM-dd') : undefined);
            setIsOpen(false); // Close the popover after selection
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;