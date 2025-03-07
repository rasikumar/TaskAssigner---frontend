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

export const fetchAllTickets = async (
  currentPage,
  filterStatus,
  itemsPerPage
) => {
  const statusQuery = filterStatus ? `&status=${filterStatus}` : "";
  try {
    const response = await Instance.get(
      `${ADMIN}/getall_ticket/?page=${currentPage}&limit=${itemsPerPage}${statusQuery}`
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
  console.log(updatedData);
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

