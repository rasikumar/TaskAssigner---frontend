import Instance from "@/API/Instance";
import { USER } from "@/utils/api";

export const dailyUpdate = async (dailyUpdateData) => {
  // console.log(dailyUpdateData);
  try {
    if (!dailyUpdateData) {
      throw new Error("dailyUpdateData is missing or invalid");
    }
    const response = await Instance.post(
      `${USER}/daliyTaskUpdate`,
      dailyUpdateData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch daily update:", error);
  }
};

export const StatusUpdate = async ({ _id, status }) => {
  try {
    if (!_id && !status) {
      throw new Error("StatusUpdate data is missing or invalid");
    }
    const response = await Instance.post(`${USER}/editStatus`, {
      _id,
      status,
    });
    if (response.data.status) {
      return response.data;
    } else {
      console.error("API failed:", response.data.message);
      throw new Error(response.data.message || "Failed to delete task");
    }
  } catch (error) {
    console.error(
      "Error in StatusUpdate:",
      error.response?.data || error.message
    );
    throw error;
  }
};
