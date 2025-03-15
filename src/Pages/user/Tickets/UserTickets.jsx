// import { fetchAllTickets } from "@/API/admin/ticket/ticket_api";
import { useState } from "react";
import Table from "@/components/customUi/Table";
// import { useQuery } from "@tanstack/react-query";
import TicketHook from "@/hooks/ticket/TicketHook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Selector from "@/components/customUi/Selector";
import PaginationComponent from "@/components/customUi/PaginationComponent";
import CreateTicket from "./UserCreateTicket";
import MainCards from "@/components/ui/cards/MainCards";
import {
  TicketCheckIcon,
  TicketIcon,
  TicketMinus,
  TicketPlusIcon,
} from "lucide-react";
// import DeleteDialog from "@/components/DeleteDialog";
import { getpriority } from "@/utils/prorityUtils";
import { getStatus } from "@/utils/statusUtils";
import { statusoptionforTicket } from "@/utils/statusOptionsforTicket";
import RoleChecker from "@/lib/RoleChecker";
import TableSkeleton from "@/components/loading/TableSkeleton";
import UserTicketDetailModal from "@/components/customUi/user/UserTicketDetailModal";
// import CreateFile from "./CreateFIle";

const UserTickets = () => {
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
    // deleteTicketMutation,
    getTicketById,
    selectedTicket,
  } = TicketHook(currentPage, filterStatus, itemsPerPage, appliedSearchTerm);
  // console.log(ticketListsError);

  // const handleDeleteTicket = (ticketId) => {
  //   // console.log(ticketId);
  //   deleteTicketMutation.mutate(ticketId);
  // };

  const getTicketId = (ticketId) => {
    getTicketById.mutate(ticketId);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (ticketData) => {
    updateTicketMutation.mutate(ticketData);
    // console.log(ticketData);
  };

  const columns = [
    { key: "subject", title: "Subject" },
    { key: "main_category", title: "Category" },
    { key: "created_by", title: "Created by" },
    { key: "date", title: "Date" },
    { key: "status", title: "Status", className: "text-center" },
    { key: "priority", title: "Priority", className: "text-center" },
  ];

  const totalpages = Math.ceil((ticketLists?.data?.total || 0) / itemsPerPage);

  // console.log(totalpages);
  const StatusSummary = ticketLists?.data?.statusSummary;
  // console.log(StatusSummary);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    setAppliedSearchTerm(searchTerm); // Update appliedSearchTerm when button is clicked
  };

  const renderRow = (ticketDetails) => (
    <>
      <td
        className="px-2 py-3 text-sm font-medium text-gray-800 w-1/4"
        onClick={() => {
          getTicketId(ticketDetails._id);
        }}
      >
        <div className="font-bold">{ticketDetails.title}</div>
        <div>{ticketDetails.description}</div>
      </td>
      <td
        onClick={() => {
          getTicketId(ticketDetails._id);
        }}
        className="px-2 py-3 text-sm font-medium text-gray-800 "
      >
        <div className="font-bold text-primary capitalize">
          {ticketDetails.sub_category}
        </div>
        <div>{ticketDetails.main_category}</div>
      </td>

      <td
        className="px-2 py-3 text-sm font-medium text-gray-800 "
        onClick={() => {
          getTicketId(ticketDetails._id);
        }}
      >
        {ticketDetails.raised_by?.name}
      </td>
      <td
        className="px-2 py-3 text-sm font-medium text-gray-800"
        onClick={() => {
          getTicketId(ticketDetails._id);
        }}
      >
        {new Date(ticketDetails.created_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td
        className="px-2 py-3 text-sm font-medium text-gray-800 text-center"
        onClick={() => {
          getTicketId(ticketDetails._id);
        }}
      >
        <span
          className={`px-2 py-1 rounded-full text-xs ${getStatus(
            ticketDetails.status
          )}`}
        >
          {ticketDetails.status}
        </span>
      </td>
      <td
        className="px-2 py-3 text-sm font-medium text-gray-800 text-center "
        onClick={() => {
          getTicketId(ticketDetails._id);
        }}
      >
        <span
          className={`px-2 py-1 rounded-full text-xs ${getpriority(
            ticketDetails.priority
          )}`}
        >
          {ticketDetails.priority}
        </span>
      </td>
      {/* <RoleChecker allowedDepartments={["testing"]} allowedRoles={[]}>
        <td className="px-2 py-3 text-sm text-center">
          <DeleteDialog
            message="Are you sure you want to delete"
            onConfirm={() => handleDeleteTicket(ticketDetails._id)}
            isLoading={deleteTicketMutation.isPending}
          />
        </td>
      </RoleChecker> */}
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
        <RoleChecker
          allowedRoles={["member", "team lead", "manager"]}
          allowedDepartments={["testing"]}
        >
          <CreateTicket />
        </RoleChecker>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search TicketName..."
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
              options={statusoptionforTicket}
            />
          </div>
        </div>
        <div className="flex lg:flex-nowrap gap-2">
          <MainCards
            title="Open"
            totaltasks={OpenTicket}
            Icon={TicketIcon}
            subtitle="Ticket"
            bgColor="#FFC107"
          />
          <MainCards
            title="In-Progress"
            totaltasks={InprogressTicket}
            Icon={TicketMinus}
            subtitle="Ticket"
            bgColor="#007BFF"
          />
          <MainCards
            title="Cancelled"
            totaltasks={ResolvedTicket}
            Icon={TicketCheckIcon}
            subtitle="Ticket"
            bgColor="#6C757D"
          />
          <MainCards
            title="Closed"
            totaltasks={ClosedTicket}
            Icon={TicketMinus}
            subtitle="Ticket"
            bgColor="#B23A48"
          />
          <MainCards
            title="Reopened"
            totaltasks={ReopenTicket}
            Icon={TicketPlusIcon}
            subtitle="Ticket"
            bgColor="#28A745"
          />
        </div>
        {isTicketListsError ? (
          <div>{ticketListsError.response.data.message}</div>
        ) : isTicketListsLoading ? (
          <TableSkeleton />
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
        <UserTicketDetailModal
          ticket={selectedTicket}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default UserTickets;
