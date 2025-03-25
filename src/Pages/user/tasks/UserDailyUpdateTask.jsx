/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const UserDailyUpdateTask = ({ _id, onUpdate }) => {
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState({
    hours: false,
    length: false
  });
  const [formData, setFormData] = useState({
    daily_update: "",
    hours_spent: "",
  });
  const [milestones, setMilestones] = useState([]); // Track milestones
  const [blinking, setBlinking] = useState(false); // Track blinking effect

  const handleButtonClick = () => {
    setShowInput(!showInput);
    // Reset errors when toggling input
    setError({ hours: false, length: false });
  };

  const handleSendClick = () => {
    const hoursSpent = Number(formData.hours_spent);
    const updateText = formData.daily_update.trim();

    if (!updateText || !formData.hours_spent) {
      return; // Don't do anything if fields are empty
    }

    // Validate update text length (minimum 5 characters)
    if (updateText.length < 5) {
      setError(prev => ({ ...prev, length: true }));
      return;
    }

    // If hours_spent is more than 8, don't update or send data
    if (hoursSpent > 8) {
      setError(prev => ({ ...prev, hours: true }));
      return;
    }

    // Clear any errors
    setError({ hours: false, length: false });

    // Proceed with updating the milestone
    const newMilestone = `${updateText} ${hoursSpent} hours`;
    setMilestones((prevMilestones) => [...prevMilestones, newMilestone]);

    // Call the onUpdate function to update the data
    onUpdate({
      _id,
      daily_update: updateText,
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
    // Clear error when user starts typing
    if (name === "daily_update" && error.length) {
      setError(prev => ({ ...prev, length: false }));
    }
    if (name === "hours_spent" && error.hours) {
      setError(prev => ({ ...prev, hours: false }));
    }
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
              placeholder="Work Update (minimum 5 characters)"
              value={formData.daily_update}
              onChange={handleChange}
            />
            {error.length && (
              <div className="text-sm text-red-500 -mt-3">
                Update must be at least 5 characters long
              </div>
            )}
            <Input
              type="number"
              name="hours_spent"
              placeholder="How Many Hours You Worked (max 8)"
              value={formData.hours_spent}
              onChange={handleChange}
            />
            {error.hours && (
              <div className="text-sm text-red-500 -mt-3">
                Hours must be 8 or less
              </div>
            )}
          </div>

          <Button 
            onClick={handleSendClick} 
            className="w-full h-8"
            disabled={!formData.daily_update || !formData.hours_spent}
          >
            Update
          </Button>
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