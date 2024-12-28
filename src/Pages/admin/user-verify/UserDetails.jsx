import { getAllUser } from "@/API/admin/userverify/userVerify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCard } from "@/components/ui/cards/userCard";
import UserDelete from "./UserDelete"; // Import UserDelete component
import { toast } from "react-toastify";

const UserDetails = () => {
  const queryClient = useQueryClient();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getAllUser,
    staleTime: 30000,
  });

  const handleDeleteUser = (userId) => {
    queryClient.setQueryData(["userDetails"], (oldUsers) =>
      oldUsers.filter((user) => user.id !== userId)
    );
    toast.success("User deleted successfully!");

    queryClient.invalidateQueries(["userDetails"]); // Refetch users after deletion
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching user details: {error.message}</div>;

  return (
    <div className="flex flex-wrap gap-4">
      {data?.data.map((user) => (
        <div key={user.id}>
          <UserCard
            id={user.id}
            name={user.name}
            role={user.role}
            number={user.phone}
            mail={user.mail}
            viewbtn={true}
            startDate={user.starting_date}
            endDate={user.lastWorking_date}
          />
          <UserDelete userId={user._id} onDelete={handleDeleteUser} />{" "}
        </div>
      ))}
    </div>
  );
};

export default UserDetails;
