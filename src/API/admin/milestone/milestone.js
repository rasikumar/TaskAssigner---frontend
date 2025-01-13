import Instance from "@/API/Instance";

const API_URL = "/admin";

export const getMilestonesForProject = async (projectId) => {
  try {
    const response = await Instance.post(`${API_URL}/getMilestonesForProject`, {
      projectId: projectId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch milestones for project:", error);
    throw error;
  }
};


