import Instance from "@/API/Instance";

const API_URL = "/admin";

export const adminDashboard = async () => {
  try {
    const adminData = await Instance.get(`${API_URL}/dashboard/`);
    return adminData.data;
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    throw error;
  }
};

export const getAllEmployeeOwnerShip = async () => {
  try {
    const EmpOwner = await Instance.get(
      `${API_URL}/getAllUserEmpMailForProject`
    );
    // console.log(EmpOwner.data);
    return EmpOwner.data;
  } catch (err) {
    console.error("Failed to fetch employee ownerShip:", err);
    throw err;
  }
};

export const getallEmployeeOwnerShip = async () => {
  try {
    const EmpOwner = await Instance.get(
      `${API_URL}/getAllUserEmpMailForProject`
    );
    // console.log(EmpOwner.data);
    return EmpOwner.data;
  } catch (err) {
    console.error("Failed to fetch employee ownerShip:", err);
    throw err;
  }
};
