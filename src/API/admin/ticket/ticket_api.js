import Instance from "../../Instance";

export const fetchAllTickets = async () => {
  try {
    const response = await Instance.post("/admin/getAllTicket");
    return response.data;
  } catch (error) {
    console.error("Error fetching Ticket", error);
    throw error;
  }
};
