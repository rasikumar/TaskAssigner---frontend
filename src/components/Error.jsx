const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">
          Oops! Something went wrong.
        </h1>
        <p className="mt-4 text-lg">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>
      </div>
    </div>
  );
};

export default Error;
