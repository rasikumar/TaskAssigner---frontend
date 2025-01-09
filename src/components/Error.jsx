import { useNavigate } from "react-router";
import { useEffect } from "react";

const Error = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">
          Oops! Something went wrong.
        </h1>
        <p className="mt-4 text-lg">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Error;
