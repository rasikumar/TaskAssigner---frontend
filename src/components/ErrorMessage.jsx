/* eslint-disable react/prop-types */
import errorImage from "@/assets/error.svg"; // Replace with your image path

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg shadow-md">
      <img src={errorImage} alt="Error" className="w-24 h-24 mb-4" />
      <p className="text-red-600 text-lg font-semibold text-center">
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;
