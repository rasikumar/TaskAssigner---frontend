import  { useState } from "react";

const NativeModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      {/* Button to open the modal */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Create Team
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
          onClick={closeModal} // Close modal when clicking on the overlay
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal box
          >
            <h2 className="text-xl font-bold mb-4">Create a New Team</h2>

            {/* Team Name Input */}
            <input
              type="text"
              placeholder="Enter team name"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            {/* Number of Roles Input */}
            <input
              type="number"
              placeholder="Number of roles"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            {/* Submit and Cancel buttons */}
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={closeModal} // Close modal when clicking submit
              >
                Submit
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                onClick={closeModal} // Close modal when clicking cancel
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NativeModal;
