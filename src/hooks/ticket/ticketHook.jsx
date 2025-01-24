import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../api/ticketApi";
import { toast } from "react-toastify";

const TicketHook = (
  currentPage,
  appliedSearchTerm,
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
      appliedSearchTerm,
      filterStatus,
      itemsPerPage,
    ],
    queryFn: fetchTickets,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("Ticket created successfully!");
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
