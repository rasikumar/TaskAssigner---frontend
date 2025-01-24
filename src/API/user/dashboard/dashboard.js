import Instance from "@/API/Instance";
import { ADMIN, USER } from "@/utils/api";

export const fetchDashBoard = async () => {
  try {
    const responses = await Instance.post(`${USER}/dashboard`);
    const response = responses.data.result.result;
    return response;
  } catch (error) {
    console.error("error fetching dashboard");
    throw error;
  }
};
export const fetchFullDashBoard = async () => {
  try {
    const responses = await Instance.post(`${USER}/dashboard`);
    const response = responses.data.result;
    return response;
  } catch (error) {
    console.error("error fetching dashboard");
    throw error;
  }
};

export const getAllEmployeeOwnerShip = async () => {
  try {
    const EmpOwner = await Instance.get(`${ADMIN}/getAllUserEmpMailForProject`);
    // console.log(EmpOwner.data);
    return EmpOwner.data;
  } catch (err) {
    console.error("Failed to fetch employee ownerShip:", err);
    throw err;
  }
};
