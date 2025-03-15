import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTicket,
  updateTicket,
  deleteTicket,
  fetchAllTickets,
  fetchTicketsById,
  getTicketDocument,
} from "@/API/admin/ticket/ticket_api";
import { toast } from "react-toastify";
import { useState } from "react";
import { updateStatus } from "@/API/user/ticket/ticket";

const TicketHook = (
  currentPage,
  filterStatus,
  itemsPerPage,
  appliedSearchTerm
) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const queryClient = useQueryClient();
  const [file, setFile] = useState("");
  // console.log(appliedSearchTerm);
  const {
    data: ticketLists,
    isLoading: isTicketListsLoading,
    error: ticketListsError,
    isError: isTicketListsError,
  } = useQuery({
    queryKey: [
      "tickets",
      currentPage,
      filterStatus,
      itemsPerPage,
      appliedSearchTerm,
    ],
    queryFn: () =>
      fetchAllTickets(
        currentPage,
        filterStatus,
        itemsPerPage,
        appliedSearchTerm
      ),
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
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error("Error submitting form:", error);
    },
  });

  const getDocumentById = useMutation({
    mutationFn: (documentId) => getTicketDocument(documentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tickets"]);
      // console.log(data)
      setFile(data);
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success(data.message || "Ticket deleted sussssccessfully!");
    },
  });

  const getTicketById = useMutation({
    mutationFn: fetchTicketsById,
    onSuccess: (data) => {
      // toast.success("Ticket fetched successfully!");
      const ticketResponse = data?.data;
      // console.log(ticketResponse);
      setSelectedTicket(ticketResponse); // Return the fetched ticket data
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Failed to fetch ticket");
      console.error("Error fetching ticket:", error);
    },
  });

  const updateTicketStatus = useMutation({
    mutationFn: updateStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success(data.message || "Ticket status updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response.data.message || "Failed to update ticket status"
      );
      console.error("Error updating ticket status:", error);
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
    getTicketById,
    selectedTicket,
    updateTicketStatus,
    getDocumentById,
    file,
  };
};

export default TicketHook;
