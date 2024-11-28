import Instance from "@/API/Instance";

export const fetchDashBoard = async () => {
  try {
    const response = await Instance.get("/user//dashboard");
    return response.data;
  } catch (error) {
    console.error("error fetching dashboard");
    throw error;
  }
};
