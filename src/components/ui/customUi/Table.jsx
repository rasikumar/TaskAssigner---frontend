/* eslint-disable react/prop-types */
const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
        <table
          className="table-auto w-full text-xs sm:text-sm md:text-base"
          role="table"
        >
          <thead
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-12"
            role="rowgroup"
          >
            <tr className="sticky top-0" role="row">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-3 py-2 text-left font-semibold sm:px-5 sm:py-3 ${
                    col.className || ""
                  }`}
                  role="columnheader"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {data.length === 0 ? (
              <tr role="row">
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                  role="cell"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors duration-150 ease-in-out border-b cursor-pointer`}
                  role="row"
                >
                  {renderRow(row, index)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
