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
