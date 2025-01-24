import Instance from "@/API/Instance";
import { USER } from "@/utils/api";

export const moveToTester = async ({ move_to_uat, _id }) => {
  try {
    if (!move_to_uat && !_id) {
      throw new Error("move_to_uav data is missing or invalid");
    }
    const response = await Instance.post(`${USER}/updateUATStatus`, {
      move_to_uat: move_to_uat,
      taskId: _id,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to move to tester:", error);
    throw error;
  }
};
