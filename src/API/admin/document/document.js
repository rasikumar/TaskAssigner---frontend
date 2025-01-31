import Instance from "@/API/Instance";
import { ADMIN } from "@/utils/api";

export const uploadDocumentAdmin = async (documentData) => {
  try {
    const response = await Instance.post(`${ADMIN}/upload`, documentData, {
      ADMIN: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to upload documents:", error);
    throw error;
  }
};

export const getAllDocumentAdmin = async () => {
  try {
    const response = await Instance.get(`${ADMIN}/getAllfiles`);
    console.log(response.data); 
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all documents:", error);
    throw error;
  }
};
