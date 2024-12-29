import Instance from "@/API/Instance";

const API_URL = "/admin";

export const adminDashboard = async () => {
  try {
    const adminData = await Instance.get(`${API_URL}/dashboard/`);
    return adminData.data;
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    throw error;
  }
};
