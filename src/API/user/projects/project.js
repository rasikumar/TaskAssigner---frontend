import Instance from "@/API/Instance";
import { USER } from "@/utils/api";

export const fetchAllUserProjects = async (page, limit, searchTerm, status) => {
  try {
    const statusQuery = status ? `&status=${status}` : "";
    const searchQuery = searchTerm ? `&search=${searchTerm}` : "";
    const response = await Instance.post(
      `${USER}/getAllProjects/?page=${page}&limit=${limit}${statusQuery}${searchQuery}`
    );
    // console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user projects:", err);
    throw err;
  }
};

export const createUserProject = async (ProjectData) => {
  try {
    const response = await Instance.post(`${USER}/createProject`, ProjectData);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to create user project:", err);
    throw err;
  }
};

export const userUpdateProject = async (updatedData) => {
  try {
    const response = await Instance.put(`${USER}/updateProject`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const userGetAllProjectList = async () => {
  try {
    const response = await Instance.get(`${USER}/getAllProjectList`);
    return response.data.projects.map((item) => ({
      value: item._id, // Map 'id' to 'value'
      label: item.project_name, // Map 'name' to 'label'
    }));
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};

export const userGetProjectView = async (projectId) => {
  try {
    const response = await Instance.get(`${USER}/get_project_document/${projectId}`, {
      responseType: "blob", // Get binary file
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching project view:", error);
    throw error;
  }
};
