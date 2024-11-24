import Instance from "../Instance";

export const fetchAllTasks = async () => {
  try {
    const response = await Instance.post("/admin/getAllTask");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const createTask = async () => {
  try {
    const response = await Instance.post("/admin/createTask");

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to create task: ${response.status}`);
    }
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};
