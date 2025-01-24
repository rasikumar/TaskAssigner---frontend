/* eslint-disable react/prop-types */
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const MoveToTester = ({ _id, move_to_uat, testerDetail }) => {
  const [isToggle, setIsToggle] = useState(testerDetail);

  const handleToggle = (checked) => {
    setIsToggle(checked);
    move_to_uat(checked, _id); // Now _id is included
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="MoveToTester"
        checked={isToggle} // Controlled component
        onCheckedChange={(checked) => handleToggle(checked)} // Passes `checked` to handleToggle
        disabled={testerDetail} // Disables the switch if testerDetail is true
      />
      <Label htmlFor="MoveToTester">Move To Tester</Label>
    </div>
  );
};

export default MoveToTester;
