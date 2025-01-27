/* eslint-disable react/prop-types */
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select an option...",
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // Filter the items based on the query
  const filteredItems = query
    ? items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          onClick={() => setOpen(!open)} // Manually toggle open state on click
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-[9999] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            onValueChange={(value) => setQuery(value)} // Update query on input change
          />
          <CommandList>
            {filteredItems.length > 0 ? (
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No items found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
