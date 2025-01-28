import { ADMIN } from "@/utils/api";
import Instance from "../../Instance";

export const createTicket = async (formDataToSend) => {
  console.log(formDataToSend);
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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating Ticket", error);
    throw error;
  }
};

export const deleteTicket = async () => {
  try {
    const response = await Instance.post(`${ADMIN}/getAllTicket`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Ticket", error);
    throw error;
  }
};

export const fetchAllTickets = async () =>
  // currentPage,
  // appliedSearchTerm,
  // filterStatus,
  // itemsPerPage
  {
    // console.log(
    //   currentPage +
    //     "s" +
    //     appliedSearchTerm +
    //     "eeee " +
    //     filterStatus +
    //     " asa" +
    //     itemsPerPage
    // );
    // const statusQuery = filterStatus ? `&status=${filterStatus}` : "";
    // const searchQuery = appliedSearchTerm ? `&search=${appliedSearchTerm}` : "";
    try {
      const response = await Instance.get(`${ADMIN}/getall_ticket`);
      // `${ADMIN}/getall_ticket/?page=${currentPage}$limit=${itemsPerPage}${statusQuery}${searchQuery}`

      return response.data;
    } catch (error) {
      console.error("Error fetching Ticket", error);
      throw error;
    }
  };

export const fetchTickets = async () => {
  try {
    const response = await Instance.post(`${ADMIN}/getAllTicket`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Ticket", error);
    throw error;
  }
};

export const updateTicket = async (updatedData) => {
  try {
    const response = await Instance.post(`${ADMIN}/updateTicket`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating Ticket", error);
    throw error;
  }
};
