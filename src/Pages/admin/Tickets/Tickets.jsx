// import { fetchAllTickets } from "@/API/admin/ticket/ticket_api";
import { useState } from "react";
import Table from "@/components/customUi/Table";
import { CirclesWithBar } from "react-loader-spinner";
// import { useQuery } from "@tanstack/react-query";
import TicketHook from "@/hooks/ticket/ticketHook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Selector from "@/components/customUi/Selector";
import PaginationComponent from "@/components/customUi/PaginationComponent";
import CreateTicket from "./CreateTicket";

const Tickets = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // For query key
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [itemsPerPage] = useState(10);

  // const { data: ticketDetails, isLoading } = useQuery({
  //   queryKey: ["tickets"],
  //   queryFn: fetchAllTickets,
  //   staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  // });

  const {
    ticketLists,
    isTicketListsLoading,
    ticketListsError,
    isTicketListsError,
    updateTicketMutation,
    deleteTicketMutation,
  } = TicketHook();
  // } = TicketHook(currentPage, appliedSearchTerm, filterStatus, itemsPerPage);

  const columns = [
    { key: "main_category", title: "Category" },
    { key: "subject", title: "Subject" },
    { key: "created_by", title: "Created by" },
    { key: "date", title: "Date" },
    { key: "status", title: "Status" },
    { key: "priority", title: "Priority" },
  ];

  const totalPages = Math.ceil((ticketLists?.total || 0) / itemsPerPage);

  const statusoption = [
    { value: "", label: "All" }, // Add this line
    { value: "Not started", label: "Not Started" },
    { value: "In progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
  ];

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    setAppliedSearchTerm(searchTerm); // Update appliedSearchTerm when button is clicked
  };

  const renderRow = (ticketDetails) => (
    <>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        <div className="font-bold text-primary">
          {ticketDetails.sub_category}
        </div>
        <div>{ticketDetails.main_category}</div>
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        <div className="font-bold">{ticketDetails.ticket_title}</div>
        <div>{ticketDetails.ticket_description}</div>
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        {ticketDetails.created_by}
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        {ticketDetails.created_date}
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            ticketDetails.status === "Open"
              ? "bg-red-100 text-red-600"
              : ticketDetails.status === "Closed"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {ticketDetails.status}
        </span>
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            ticketDetails.priority === "Low"
              ? "bg-blue-100 text-blue-600"
              : ticketDetails.priority === "Regular"
              ? "bg-gray-100 text-gray-600"
              : ticketDetails.priority === "High"
              ? "bg-orange-100 text-orange-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {ticketDetails.priority}
        </span>
      </td>
    </>
  );

  return (
    <div>
      <div className="relative mt-0 flex flex-col gap-4">
        <CreateTicket />
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search TaskName..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <div className="flex items-center gap-2">
            <Label>Status</Label>
            <Selector
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={statusoption}
            />
          </div>
        </div>
        {isTicketListsLoading ? (
          <div className="flex items-center justify-center w-full h-full ">
            <CirclesWithBar
              color="#4fa94d"
              outerCircleColor="#4fa94d"
              innerCircleColor="#4fa94d"
              barColor="#4fa94d"
              visible={true}
            />
          </div>
        ) : (
          <div>
            <Table
              columns={columns}
              data={ticketLists?.data || []}
              renderRow={renderRow}
            />
            <div>
              <PaginationComponent
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
