import { ADMIN } from "@/utils/api";
import Instance from "../../Instance";

export const createTicket = async (formDataToSend) => {
  // console.log(formDataToSend);
  try {
    const response = await Instance.post(
      `${ADMIN}/createTicket`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating Ticket", error);
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await Instance.delete(
      `${ADMIN}/deleteTickets/${ticketId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Ticket", error);
    throw error;
  }
};

export const getTicketDocument = async (documentId) => {
  try {
    const response = await Instance.get(
      `${ADMIN}/get_ticket_document/${documentId}`,
      {
        responseType: "blob", // Get binary file
      }
    );
    // console.log(response.data)
    return response.data; // Return Blob directly
  } catch (error) {
    console.error("Error fetching Ticket document", error);
    throw error;
  }
};

export const fetchAllTickets = async (
  currentPage,
  filterStatus,
  itemsPerPage,
  appliedSearchTerm
) => {
  // console.log(appliedSearchTerm);
  const statusQuery = filterStatus ? `&status=${filterStatus}` : "";
  const searchQuery = appliedSearchTerm ? `&search=${appliedSearchTerm}` : "";
  try {
    const response = await Instance.get(
      `${ADMIN}/getall_ticket/?page=${currentPage}&limit=${itemsPerPage}${statusQuery}${searchQuery}`
    );

    // Check if data is empty
    if (!response.data || response.data.length === 0) {
      return { message: "No tickets found" };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching Ticket", error);
    throw error;
  }
};

export const fetchTicketsById = async (ticketId) => {
  // console.log(ticketId);
  try {
    const response = await Instance.get(`${ADMIN}/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Ticket", error);
    throw error;
  }
};

export const updateTicket = async (updatedData) => {
  // console.log(updatedData);
  const formData = new FormData();

  for (const key in updatedData) {
    formData.append(key, updatedData[key]);
  }

  try {
    const response = await Instance.post(`${ADMIN}/updateTicket`, updatedData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating Ticket", error);
    throw error;
  }
};

export const updateTesterApproval = async (status) => {
  try {
    const response = await Instance.patch(`${ADMIN}/updateTesterApproval`, {
      taskId: status._id,
      tester_approval: status.tester_approval,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating tester approval", error);
    throw error;
  }
};
