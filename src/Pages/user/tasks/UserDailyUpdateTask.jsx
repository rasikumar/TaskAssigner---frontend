/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const UserDailyUpdateTask = ({ _id, onUpdate }) => {
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    daily_update: "",
    hours_spent: "",
  });
  const [milestones, setMilestones] = useState([]); // Track milestones
  const [blinking, setBlinking] = useState(false); // Track blinking effect

  const handleButtonClick = () => {
    setShowInput(!showInput);
  };

  const handleSendClick = () => {
    const hoursSpent = Number(formData.hours_spent);

    if (!formData.daily_update || !formData.hours_spent) {
      return; // Don't do anything if fields are empty
    }

    // If hours_spent is more than 8, don't update or send data
    if (hoursSpent > 8) {
      setError(true);
      return; // Simply ignore and return without any further action
    }

    // Proceed with updating the milestone
    const newMilestone = `${formData.daily_update} ${formData.hours_spent} hours`;
    setMilestones((prevMilestones) => [...prevMilestones, newMilestone]);

    // Call the onUpdate function to update the data
    onUpdate({
      _id,
      daily_update: formData.daily_update,
      hours_spent: hoursSpent,
    });

    // Clear input fields after updating
    setShowInput(false);
    setFormData({ daily_update: "", hours_spent: "" });

    // Trigger blinking effect
    setBlinking(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Reset blinking after 2 seconds
  useEffect(() => {
    if (blinking) {
      const timer = setTimeout(() => {
        setBlinking(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [blinking]);

  return (
    <div>
      <Button className="w-full h-8 " onClick={handleButtonClick}>
        <PlusIcon />
      </Button>
      {showInput && (
        <div className="flex flex-col">
          <div className="flex my-4 flex-col gap-4">
            <Textarea
              type="text"
              name="daily_update"
              placeholder="Work Update"
              value={formData.daily_update}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="hours_spent"
              placeholder="How Many Hour You Work"
              value={formData.hours_spent}
              onChange={handleChange}
            />
          </div>

          <Button onClick={handleSendClick} className="w-full h-8 ">
            Update
          </Button>
          {error && (
            <div className="text-sm mt-2 text-red-500">
              Hour Must 8 hours only
            </div>
          )}
        </div>
      )}

      <ul className="space-y-2 text-sm text-gray-700">
        {milestones.map((milestone, index) => (
          <li
            key={index}
            className={`mt-4 -mb-2 border border-green-700 flex justify-center items-center p-2 rounded-lg overflow-hidden break-words ${
              blinking ? "blink" : ""
            }`}
          >
            <span>{milestone}</span>
          </li>
        ))}
      </ul>

      {/* CSS for blinking effect */}
      <style>{`
        .blink {
          animation: blink-animation 2s ease-in-out 2;
        }

        @keyframes blink-animation {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDailyUpdateTask;
