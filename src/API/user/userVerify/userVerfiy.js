import Instance from "@/API/Instance";
import { USER } from "@/utils/api";

export const getEmpMails = async () => {
  try {
    const response = await Instance.get(`${USER}/getEmpMails`);
    return response.data.data.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  } catch (error) {
    console.error("getEmpMails", error);
    throw error;
  }
};
