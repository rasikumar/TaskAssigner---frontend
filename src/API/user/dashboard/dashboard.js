import Instance from "@/API/Instance";

export const fetchDashBoard = async () => {
  try {
    const responses = await Instance.post("/user/dashboard");
    const response = responses.data.result.result;
    return response;
  } catch (error) {
    console.error("error fetching dashboard");
    throw error;
  }
};
export const fetchFullDashBoard = async () => {
  try {
    const responses = await Instance.post("/user/dashboard");
    const response = responses.data.result;
    return response;
  } catch (error) {
    console.error("error fetching dashboard");
    throw error;
  }
};
