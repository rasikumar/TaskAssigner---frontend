import Instance from "@/API/Instance";
import { ADMIN } from "@/utils/api";

// Create a new project
export const createProject = async (projectData) => {
  // console.log(projectData);
  try {
    const response = await Instance.post(
      `${ADMIN}/createProject`,
      projectData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Failed to create project");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const fetchAllProjects = async (page, limit, searchTerm, status) => {
  try {
    // Construct the query parameters, including status and search term
    const statusQuery = status ? `&status=${status}` : "";
    const searchQuery = searchTerm ? `&search=${searchTerm}` : "";
    // console.log(page, limit, status);
    // Make a GET request with query parameters, adding sort by createdAt in descending order
    const response = await Instance.post(
      `${ADMIN}/getAllProjects/?page=${page}&limit=${limit}${statusQuery}${searchQuery}`
    );

    // Validate response
    if (response.data && response.data.data) {
      // console.log(response.data.data);
      return response.data.data; // Return the sorted project data
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Fetch a single project by ID
export const fetchProjectById = async (projectId) => {
  try {
    const response = await Instance.get(`${ADMIN}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Update a project by ID
export const updateProject = async (updatedData) => {
  console.log("from api", updatedData);
  try {
    const response = await Instance.put(`${ADMIN}/updateProject`, updatedData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project by ID
export const deleteProject = async (projectId) => {
  try {
    const response = await Instance.delete(
      `${ADMIN}/deleteProject/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const getAllProjectList = async () => {
  try {
    const response = await Instance.get(`${ADMIN}/getAllProjectList`);
    return response.data.projects.map((item) => ({
      value: item._id, // Map 'id' to 'value'
      label: item.project_name, // Map 'name' to 'label'
    }));
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};

export const getProjectRelatedMilestone = async (projectId) => {
  try {
    const response = await Instance.get(
      `${ADMIN}/getProjectRelatedMilestone`,
      projectId
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project related milestone:", error);
    throw error;
  }
};

export const fetchProjectByStatus = async (status) => {
  try {
    const response = await Instance.get(`${ADMIN}/projects?status=${status}`);
    // console.log("asd", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching project by status:", error);
    throw error;
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await Instance.post(
      `${ADMIN}/getProjectById/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project by id:", error);
    throw error;
  }
};

export const GetProjectView = async (projectId) => {
  try {
    const response = await Instance.get(
      `${ADMIN}/get_project_document/${projectId}`,
      {
        responseType: "blob", // Get binary file
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project view:", error);
    throw error;
  }
};
