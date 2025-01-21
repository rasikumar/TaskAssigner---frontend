import Instance from "@/API/Instance";
import { ADMIN } from "@/utils/api";

export const adminDashboard = async () => {
  try {
    const adminData = await Instance.get(`${ADMIN}/dashboard/`);
    return adminData.data;
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
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
