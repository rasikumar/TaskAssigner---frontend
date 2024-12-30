import {
  deleteUser,
  getAllUser,
  updateUser,
} from "@/API/admin/userverify/userVerify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteUser from "./DeleteUser";
import { CirclesWithBar } from "react-loader-spinner";
import Table from "@/components/ui/customUi/Table";
import { useState } from "react";
import { UserDetailModal } from "@/components/ui/customUi/UserDetailModal";
import { toast } from "react-toastify";

const UserDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const queryClient = useQueryClient();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getAllUser,
    staleTime: 30000,
  });

  // console.log(data?.data);

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails"]);
    },
    onError: (err) => {
      console.log("Error deleting user", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails"]);
      setIsModalOpen(false); //
      toast.success("User created successfully!");
    },
    onError: (err) => {
      console.log("error", err);
    },
  });

  const handleDelete = (userId) => {
    deleteMutation.mutate(userId);
  };

  const handleEditUser = (updatedUser) => {
    updateMutation.mutate(updatedUser);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching user details: {error.message}</div>;

  const columns = [
    { key: "name", title: "Name" },
    { key: "starting_date", title: "Start Date", className: "text-center" },
    { key: "lastWorking_date", title: "End Date", className: "text-center" },
    { key: "phone", title: "Phone", className: "text-center" },
    { key: "action", title: "Action", className: "text-center" },
  ];

  const renderRow = (user) => (
    <>
      <td
        onClick={() => {
          handleUserClick(user);
        }}
        className="px-2 py-3 text-sm flex flex-col gap-2"
      >
        <span className="font-bold text-primary">{user.name}</span>
        <span>{user.role}</span>
      </td>
      <td className={`px-2 py-2 text-center text-xs font-semibold`}>
        <span>{user.starting_date}</span>
      </td>
      <td className={`px-2 py-2 text-center text-xs font-semibold`}>
        <span>{user.lastWorking_date}</span>
      </td>
      <td className={`px-2 py-2 text-center text-xs font-semibold`}>
        <span>{user.phone}</span>
      </td>
      <td className="px-2 py-3 text-sm text-blue-500 cursor-pointer flex flex-col items-center">
        <DeleteUser
          onConfirm={() => handleDelete(user._id)}
          isLoading={deleteMutation.isPending}
        />
      </td>
    </>
  );

  return (
    <div className="mx-auto w-full gap-4">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <CirclesWithBar
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#4fa94d"
            visible={true}
          />
        </div>
      ) : (
        <Table
          columns={columns}
          data={data?.data || []}
          renderRow={renderRow}
        />
      )}
      {isModalOpen && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleEditUser}
        />
      )}
    </div>
  );
};

export default UserDetails;
