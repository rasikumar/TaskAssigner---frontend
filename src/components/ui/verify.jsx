/* eslint-disable react/prop-types */
const Verify = ({ isOpen, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
