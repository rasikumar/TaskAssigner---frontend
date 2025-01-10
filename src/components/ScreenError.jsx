const ScreenError = () => {
  return (
    <div className="flex flex-col justify-center items-center no-content-message text-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-red-600">
          Access Limited to Desktop or Laptop
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          It looks like you&apos;re using a mobile device. For a better task
          management experience, please use a desktop or laptop device to access
          the full functionality of this app.
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            We apologize for the inconvenience.
          </p>
          <p className="text-sm text-gray-500">
            To stay productive, consider switching to a larger screen to manage
            your tasks more effectively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenError;
