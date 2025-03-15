import Instance from "@/API/Instance";
import { USER } from "@/utils/api";

export const uploadDocument = async (documentData) => {
  try {
    const response = await Instance.post(
      `${USER}/upload_document`,
      documentData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to upload documents:", error);
    throw error;
  }
};

export const getAllDocument = async () => {
  try {
    const response = await Instance.get(`${USER}/getAllfiles`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all documents:", error);
    throw error;
  }
};

export const getDocument = async (documentID) => {
  try {
    const response = await Instance.get(`${USER}/uploads/${documentID}`, {
      responseType: "blob",
    });
    // const fileURL = URL.createObjectURL(
    //   new Blob([response.data], { type: "application/pdf" })
    // );
    // window.open(fileURL); // Opens the PDF in a new tab
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch document:", error);
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  // console.log(documentId);
  try {
    const response = await Instance.delete(`${USER}/delete/${documentId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete document:", error);
    throw error;
  }
};
