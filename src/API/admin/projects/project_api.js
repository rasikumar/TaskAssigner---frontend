import Instance from "@/API/Instance";

const API_URL = "/admin";

// Create a new project
export const createProject = async (projectData) => {
  try {
    const response = await Instance.post(`${API_URL}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Fetch all projects with optional pagination
// data: {
//   total: 85,
//   projects: Array.from({ length: limit }, (_, index) => ({
//     project_title: `Project ${index + 1 + (page - 1) * limit}`,
//     project_ownership: `Owner ${index + 1 + (page - 1) * limit}`,
//     start_date: `2023-01-${String(index + 1).padStart(2, "0")}`,
//     end_date: `2023-02-${String(index + 1).padStart(2, "0")}`,
//     status: index % 2 === 0 ? "Completed" : "In progress",
//   })),
// },

export const fetchAllProjects = async (page, limit) => {
  try {
    const response = await Instance.post(`${API_URL}/getAllProjects`, {
      page: page,
      limit: limit,
    });
    
    if (response.data && response.data.data) {
      return response.data.data;
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
    const response = await Instance.get(`${API_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Update a project by ID
export const updateProject = async (projectId, updatedData) => {
  try {
    const response = await Instance.put(`${API_URL}/${projectId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project by ID
export const deleteProject = async (projectId) => {
  try {
    const response = await Instance.delete(`${API_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
