import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTicket,
  updateTicket,
  deleteTicket,
  fetchAllTickets,
} from "@/API/admin/ticket/ticket_api";
import { toast } from "react-toastify";

const TicketHook = (
  currentPage,
  // appliedSearchTerm,
  filterStatus,
  itemsPerPage
) => {
  const queryClient = useQueryClient();

  const {
    data: ticketLists,
    isLoading: isTicketListsLoading,
    error: ticketListsError,
    isError: isTicketListsError,
  } = useQuery({
    queryKey: [
      "tickets",
      currentPage,
      // appliedSearchTerm,
      filterStatus,
      itemsPerPage,
    ],
    queryFn: () => fetchAllTickets(currentPage, filterStatus, itemsPerPage),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tickets"]);
      // console.log(data?.message)
      toast.success(data?.message || "Ticket created successfully!");
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error("Error submitting form:", error);
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("Ticket updated successfully!");
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("Ticket deleted successfully!");
    },
  });

  return {
    ticketLists,
    isTicketListsLoading,
    ticketListsError,
    isTicketListsError,
    createTicketMutation,
    updateTicketMutation,
    deleteTicketMutation,
  };
};

export default TicketHook;
