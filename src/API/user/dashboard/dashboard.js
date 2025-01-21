import Instance from "@/API/Instance";
import { USER } from "@/utils/api";

export const fetchDashBoard = async () => {
  try {
    const responses = await Instance.post(`${USER}/dashboard`);
    const response = responses.data.result.result;
    return response;
  } catch (error) {
    console.error("error fetching dashboard");
    throw error;
  }
};
export const fetchFullDashBoard = async () => {
  try {
    const responses = await Instance.post(`${USER}/dashboard`);
    const response = responses.data.result;
    return response;
  } catch (error) {
    console.error("error fetching dashboard");
    throw error;
  }
};
