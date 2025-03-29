import {
  getEmpByDepartment,
  getPersonDetail,
} from "@/API/admin/team_management/teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import { toast } from "react-toastify";

const ADMIN_DOCUMENTS_QUERY_KEY = "adminDocuments";
const AdminTeams = () => {
  const queryClient = useQueryClient();

  const getAllEmpByDepartment = useMutation({
    mutationFn: (departmentId) => getEmpByDepartment(departmentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries([ADMIN_DOCUMENTS_QUERY_KEY]);
      console.log(data);
      return data;
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const getPersonDetails = useMutation({
    mutationFn: (person) => getPersonDetail(person),
    onSuccess: (data) => {
      queryClient.invalidateQueries([ADMIN_DOCUMENTS_QUERY_KEY]);
      //   console.log(data);
      return data;
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    getAllEmpByDepartment,
    getPersonDetails,
  };
};

export default AdminTeams;
