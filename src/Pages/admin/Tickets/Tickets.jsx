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
import MainCards from "@/components/ui/cards/MainCards";
import {
  TicketCheckIcon,
  TicketIcon,
  TicketMinus,
  TicketPlusIcon,
} from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import TicketDetailModal from "@/components/customUi/admin/TicketDetailModal";
// import CreateFile from "./CreateFIle";

const Tickets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // For query key
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [itemsPerPage] = useState(10);

  const {
    ticketLists,
    isTicketListsLoading,
    ticketListsError,
    isTicketListsError,
    updateTicketMutation,
    deleteTicketMutation,
    getTicketById,
    selectedTicket,
  } = TicketHook(currentPage, filterStatus, itemsPerPage);
  console.log(ticketListsError);

  const handleDeleteTicket = (ticketId) => {
    console.log(ticketId);
    deleteTicketMutation.mutate(ticketId);
  };

  const getTicketId = (ticketId) => {
    getTicketById.mutate(ticketId);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (ticketData) => {
    updateTicketMutation.mutate(ticketData);
    // console.log(ticketData);
  };

  const columns = [
    { key: "main_category", title: "Category" },
    { key: "subject", title: "Subject" },
    { key: "created_by", title: "Created by" },
    { key: "date", title: "Date" },
    { key: "status", title: "Status", className: "text-center" },
    { key: "priority", title: "Priority", className: "text-center" },
    { key: "action", title: "Action", className: "text-center" },
  ];

  const totalpages = Math.ceil((ticketLists?.data?.total || 0) / itemsPerPage);

  // console.log(totalpages);
  const StatusSummary = ticketLists?.data?.statusSummary;
  // console.log(StatusSummary);

  const statusoption = [
    { value: "", label: "All" },
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" },
    { value: "Closed", label: "Closed" },
    { value: "Reopen", label: "Reopen" },
  ];

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    setAppliedSearchTerm(searchTerm); // Update appliedSearchTerm when button is clicked
  };

  const renderRow = (ticketDetails) => (
    <>
      <td
        onClick={() => {
          getTicketId(ticketDetails._id);
        }}
        className="px-2 py-3 text-sm font-medium text-gray-800 "
      >
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
      <td className="px-2 py-3 text-sm font-medium text-gray-800 text-center">
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
      <td className="px-2 py-3 text-sm font-medium text-gray-800 text-center ">
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
      <td className="px-2 py-3 text-sm text-center">
        <DeleteDialog
          message="Are you sure you want to delete"
          onConfirm={() => handleDeleteTicket(ticketDetails._id)}
          isLoading={deleteTicketMutation.isPending}
        />
      </td>
    </>
  );

  const OpenTicket = StatusSummary?.Open || 0;
  const InprogressTicket = StatusSummary?.["In Progress"] || 0;
  const ResolvedTicket = StatusSummary?.Resolved || 0;
  const ClosedTicket = StatusSummary?.Closed || 0;
  const ReopenTicket = StatusSummary?.Reopen || 0;

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
        <div className="flex lg:flex-nowrap gap-2">
          <MainCards
            title="Yet to Start"
            totaltasks={OpenTicket}
            Icon={TicketIcon}
            subtitle="Task"
            bgColor="#FFC107"
          />
          <MainCards
            title="Pending"
            totaltasks={InprogressTicket}
            Icon={TicketMinus}
            subtitle="Task"
            bgColor="#007BFF"
          />
          <MainCards
            title="Cancelled"
            totaltasks={ResolvedTicket}
            Icon={TicketCheckIcon}
            subtitle="Task"
            bgColor="#6C757D"
          />
          <MainCards
            title="In-Progress"
            totaltasks={ClosedTicket}
            Icon={TicketMinus}
            subtitle="Task"
            bgColor="#B23A48"
          />
          <MainCards
            title="Completed"
            totaltasks={ReopenTicket}
            Icon={TicketPlusIcon}
            subtitle="Task"
            bgColor="#28A745"
          />
        </div>
        {isTicketListsError ? (
          <div>{ticketListsError.response.data.message}</div>
        ) : isTicketListsLoading ? (
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
              data={ticketLists?.data?.tickets || []}
              renderRow={renderRow}
            />
          </div>
        )}
        <div>
          <PaginationComponent
            totalPages={totalpages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      {isModalOpen && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default Tickets;
