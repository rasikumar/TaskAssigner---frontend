import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProjects } from "@/API/admin/projects/project_api";
import { CirclesWithBar } from "react-loader-spinner";
import { toast } from "react-toastify";
import Table from "@/components/ui/table"; // Import the reusable Table component
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import ShadCN pagination components

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(15);
  // Fetch Projects using React Query with pagination support
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["projects", currentPage],
    queryFn: () => fetchAllProjects(currentPage, itemsPerPage), // Pass currentPage and itemsPerPage to fetchAllProjects
    staleTime: 30000, // Cache projects for 30 seconds
    onError: () => toast.error("Error fetching projects"),
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
    { key: "project_title", title: "Project Title" },
    { key: "project_ownership", title: "Project Ownership" },
    { key: "start_date", title: "Start Date" },
    { key: "end_date", title: "End Date" },
    { key: "status", title: "Status" },
  ];

  const renderRow = (project) => (
    <>
      <td className="px-2 py-3 text-sm">{project.project_title}</td>
      <td className="px-2 py-3 text-sm">{project.project_ownership}</td>
      <td className="px-2 py-3 text-sm">{project.start_date}</td>
      <td className="px-2 py-3 text-sm">{project.end_date}</td>
      <td className="px-2 py-3 text-sm">{project.status}</td>
    </>
  );

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage); // Total number of pages

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem
            key={i}
            onClick={() => setCurrentPage(i)}
            className={
              currentPage === i ? "rounded-lg bg-taskBlack text-white" : ""
            }
          >
            <PaginationLink>{i}</PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      if (currentPage > 1) {
        items.push(
          <PaginationItem
            key={1}
            onClick={() => setCurrentPage(1)}
            className={
              currentPage === 1 ? "rounded-lg bg-taskBlack text-white" : ""
            }
          >
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-prev">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem
            key={i}
            onClick={() => setCurrentPage(i)}
            className={
              currentPage === i ? "rounded-lg bg-taskBlack text-white" : ""
            }
          >
            <PaginationLink>{i}</PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-next">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if (currentPage < totalPages) {
        items.push(
          <PaginationItem
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={
              currentPage === totalPages
                ? "rounded-lg bg-taskBlack text-white"
                : ""
            }
          >
            <PaginationLink>{totalPages}</PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="relative h-full">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <CirclesWithBar
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#4fa94d"
            visible={true}
          />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={data?.projects || []}
            renderRow={renderRow}
          />
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || totalPages === 0} // Disable if no previous page or no pages
                  className={
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  } // Add styles to indicate disabled state
                />
                {renderPaginationItems()}
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0} // Disable if no next page or no pages
                  className={
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } // Add styles to indicate disabled state
                />
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
