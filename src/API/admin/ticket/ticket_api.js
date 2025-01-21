import { ADMIN } from "@/utils/api";
import Instance from "../../Instance";

export const fetchAllTickets = async () => {
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
