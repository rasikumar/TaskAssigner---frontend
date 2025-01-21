import { USER } from "@/utils/api";
import Instance from "../Instance";

export const getAllEmployeeOwnerShip = async () => {
  try {
    const EmpOwner = await Instance.get(`${USER}/getAllUserEmpMailForProject`);
    // console.log(EmpOwner.data);
    return EmpOwner.data;
  } catch (err) {
    console.error("Failed to fetch employee ownerShip:", err);
    throw err;
  }
};
