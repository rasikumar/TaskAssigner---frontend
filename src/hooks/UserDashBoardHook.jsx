import { fetchAllTasks } from "@/API/admin/task/task_api";
import { fetchProjectDataUser } from "@/API/user/dashboard/dashboard";
import { useQuery } from "@tanstack/react-query";

const UserDashBoardHook = () => {
  const {
    data: userProjectData,
    isLoading: isUserProjectDataLoading,
    isError: isUserProjectDataError,
    error: userProjectDataError,
  } = useQuery({
    queryKey: ["userProjectDashboard"],
    queryFn: fetchProjectDataUser,  // ✅ Correct way to define queryFn
    staleTime: 30000,
  });

  const {
    data: userTaskData,
    isLoading: isUserTaskDataLoading,
    isError: isUserTaskDataError,
    error: userTaskDataError,
  } = useQuery({
    queryKey: ["userTaskDashboard"],
    queryFn: fetchAllTasks,  // ✅ Correct way to define queryFn
    staleTime: 30000,
  });

  return {
    userProjectData,
    isUserProjectDataLoading,
    isUserProjectDataError,
    userProjectDataError,
    userTaskData,
    isUserTaskDataLoading,
    isUserTaskDataError,
    userTaskDataError,
  };
};

export default UserDashBoardHook;
