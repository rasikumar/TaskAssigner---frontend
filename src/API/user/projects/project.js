import Instance from "@/API/Instance";

const API_URL = "user";

export const fetchAllUserProjects = async (page, limit, searchTerm, status) => {
  try {
    const statusQuery = status ? `&status=${status}` : "";
    const searchQuery = searchTerm ? `&search=${searchTerm}` : "";
    const response = await Instance.get(
      `${API_URL}/getAllProjects/?page=${page}&limit=${limit}${statusQuery}${searchQuery}`
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user projects:", err);
    throw err;
  }
};

export const createUserProject = async (ProjectData) => {
  try {
    const response = await Instance.post(
      `${API_URL}/createProject`,
      ProjectData
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to create user project:", err);
    throw err;
  }
};
