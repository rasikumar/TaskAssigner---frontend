import Instance from "@/API/Instance";

import { useEffect, useState } from "react";

const UserDashboard = () => {
  const [name, setName] = useState(null);
  useEffect(() => {
    const responseName = async () => {
      try {
        const response = await Instance.get("/admin/dashboard/");
        setName(response.data.data.mail);
      } catch (error) {
        console.error(error);
      }
    };
    responseName();
  }, []);
  return (
    <div>
      Welcome, Please enter yasasaour name to proceed.{name}
      <h1>sdDSA</h1>
      <div>asdas</div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"></header>
    </div>
  );
};

export default UserDashboard;
