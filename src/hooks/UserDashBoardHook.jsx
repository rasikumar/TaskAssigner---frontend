import { fetchFullDashBoard } from "@/API/user/dashboard/dashboard";
import { useQuery } from "@tanstack/react-query";

const UserDashBoardHook = () => {
  const {
    data: userTaskData,
    isLoading: isUserTaskDataLoading,
    isError: isUserTaskDataError,
    error: userTaskDataError,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: fetchFullDashBoard,
    staleTime: 30000,
  });
  console.log(userTaskData);

  return {
    userTaskData,
    isUserTaskDataLoading,
    isUserTaskDataError,
    userTaskDataError,
  };
};

export default UserDashBoardHook;
