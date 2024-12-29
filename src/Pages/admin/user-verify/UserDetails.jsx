import { deleteUser, getAllUser } from "@/API/admin/userverify/userVerify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCard } from "@/components/ui/cards/userCard";
import DeleteUser from "./DeleteUser";

const UserDetails = () => {
  const queryClient = useQueryClient();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getAllUser,
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails"]);
    },
    onError: (err) => {
      console.log("Error deleting user", err);
    },
  });

  const handleDelete = (userId) => {
    deleteMutation.mutate(userId);
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
            actionButton={
              <DeleteUser
                onConfirm={() => handleDelete(user._id)}
                isLoading={deleteMutation.isPending}
              />
            }
          />
        </div>
      ))}
    </div>
  );
};

export default UserDetails;
