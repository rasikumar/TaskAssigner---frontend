import {
  userGetEmpByDepartment,
  userGetPersonDetail,
} from "@/API/admin/team_management/teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import { toast } from "react-toastify";

const USER_DOCUMENTS_QUERY_KEY = "adminDocuments";
const Teams = () => {
  const queryClient = useQueryClient();

  const userGetAllEmpByDepartment = useMutation({
    mutationFn: (departmentId) => userGetEmpByDepartment(departmentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries([USER_DOCUMENTS_QUERY_KEY]);
      console.log(data);
      return data;
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const userGetPersonDetails = useMutation({
    mutationFn: (person) => userGetPersonDetail(person),
    onSuccess: (data) => {
      queryClient.invalidateQueries([USER_DOCUMENTS_QUERY_KEY]);
        // console.log(data);
      return data;
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    userGetAllEmpByDepartment,
    userGetPersonDetails,
  };
};

export default Teams;
