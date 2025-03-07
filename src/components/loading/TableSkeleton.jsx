import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <th key={index} className="p-3 border border-gray-200">
                <Skeleton className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border border-gray-200">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <td key={colIndex} className="p-3 border border-gray-200">
                  <Skeleton className="h-4 w-32" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
