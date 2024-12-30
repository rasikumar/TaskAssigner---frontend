import Instance from "../../Instance";
const API_URL = "/admin";

export const fetchAllTickets = async () => {
  try {
    const response = await Instance.post(`${API_URL}/getAllTicket`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Ticket", error);
    throw error;
  }
};

export const updateTicket = async (updatedData) => {
  try {
    const response = await Instance.post(
      `${API_URL}/updateTicket`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating Ticket", error);
    throw error;
  }
};
