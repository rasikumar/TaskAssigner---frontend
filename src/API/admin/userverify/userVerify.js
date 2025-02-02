/* eslint-disable no-useless-catch */
import Instance from "@/API/Instance";
import { ADMIN, USER } from "@/utils/api";

export const createUser = async (userData) => {
  try {
    const response = await Instance.post(`${USER}/create`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await Instance.put(`${ADMIN}/update`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUser = async (page = 1, limit = 10) => {
  try {
    const response = await Instance.post(
      `${ADMIN}/getAllEmployee?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error("Task ID is missing or invalid");
    }

    const response = await Instance.post(`${ADMIN}/delete`, {
      id: userId,
    });

    if (response.data.status) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to delete task");
    }
  } catch (error) {
    throw error;
  }
};

export const verifyUserSignup = async (userId) => {
  try {
    const response = await Instance.post(`${ADMIN}/verify/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLastEmployeeId = async (department) => {
  try {
    const response = await Instance.post(`${ADMIN}/empid-generate`, {
      department: department,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    console.error("getLastEmployeeId", error);
    throw error;
  }
};

export const getEmpMails = async () => {
  try {
    const response = await Instance.get(`${ADMIN}/getEmpMails`);
    return response.data.data.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  } catch (error) {
    console.error("getEmpMails", error);
    throw error;
  }
};
