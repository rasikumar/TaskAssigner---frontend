/* eslint-disable react/prop-types */

const Table = ({ columns, data, renderRow }) => {
  return (
    <table className="table-auto border-collapse w-full mt-4 text-xs shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-12">
        <tr className="sticky top-0">
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-5 py-2 text-left font-semibold ${
                col.className || ""
              }`}
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={row.id}
            className={`${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } hover:bg-gray-100 transition-colors duration-150 ease-in-out border-b cursor-pointer`}
          >
            {renderRow(row, index)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
