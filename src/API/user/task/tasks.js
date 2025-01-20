import Instance from "@/API/Instance";

const API_URL = "/user";

export const dailyUpdate = async (dailyUpdateData) => {
  // console.log(dailyUpdateData);
  try {
    if (!dailyUpdateData) {
      throw new Error("dailyUpdateData is missing or invalid");
    }
    const response = await Instance.post(
      `${API_URL}/daliyTaskUpdate`,
      dailyUpdateData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch daily update:", error);
  }
};
