/* eslint-disable no-useless-catch */
import Instance from "@/API/Instance";
import { ADMIN, USER } from "@/utils/api";

export const getEmpByDepartment = async (departmentId) => {
  try {
    const response = await Instance.post(`${ADMIN}/getDepartmentWiseEmployee`, {
      department: departmentId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPersonDetail = async (employeeId) => {
  //   console.log(employeeId);
  try {
    const response = await Instance.post(`${ADMIN}/getTaskByEmployee`, {
      employeeId: employeeId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userGetEmpByDepartment = async (departmentId) => {
  try {
    const response = await Instance.post(`${USER}/getDepartmentWiseEmployee`, {
      department: departmentId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userGetPersonDetail = async (employeeId) => {
  try {
    const response = await Instance.post(`${USER}/getTaskByEmployee`, {
      employeeId: employeeId,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
