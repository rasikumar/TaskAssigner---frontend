import Instance from "@/API/Instance";

const API_URL = "/admin";

// Create a new project
export const createProject = async (projectData) => {
  try {
    const response = await Instance.post(
      `${API_URL}/createProject`,
      projectData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const fetchAllProjects = async (page, limit) => {
  try {
    // Make a GET request with query parameters, adding sort by createdAt in descending order
    const response = await Instance.post(
      `${API_URL}/getAllProjects/?page=${page}&limit=${limit}&sort=-createdAt`
    );
    
    // Validate response
    if (response.data && response.data.data) {
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
    const response = await Instance.get(`${API_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Update a project by ID
export const updateProject = async (updatedData) => {
  try {
    const response = await Instance.put(
      `${API_URL}/updateProject`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project by ID
export const deleteProject = async (projectId) => {
  try {
    const response = await Instance.delete(`${API_URL}/deleteProject/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error; 
  }
};
