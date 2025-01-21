import Instance from "@/API/Instance";
import { ADMIN } from "@/utils/api";


export const getMilestonesForProject = async (projectId) => {
  try {
    const response = await Instance.post(`${ADMIN}/getMilestonesForProject`, {
      projectId: projectId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch milestones for project:", error);
    throw error;
  }
};


