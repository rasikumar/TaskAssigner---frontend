/* eslint-disable react/prop-types */
import { GrClose } from "react-icons/gr";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 inline-flex items-center justify-between w-full">
          {title}
          <GrClose className="cursor-pointer" onClick={onClose} />
        </h2>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
