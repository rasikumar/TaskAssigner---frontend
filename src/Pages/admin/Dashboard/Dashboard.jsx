import Instance from "@/API/Instance";
import MainCards from "@/components/ui/cards/MainCards";

import { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";

const Dashboard = () => {
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
    <div className="flex flex-col gap-4">
      Welcome, Please enter your name to proceed.{name}
      <section className="flex lg:flex-nowrap flex-wrap w-full gap-4">
        {/* First Column */}
        <div className="flex flex-col w-full ">
          {/* Projects Section */}
          <h1 className="text-lg font-semibold mb-2">Projects</h1>
          <div className="flex gap-4">
            <MainCards
              title="Pending"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#B23A48"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#DCA74B"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#566E3D"
            />
          </div>

          {/* Tasks Section */}
          <h1 className="text-lg font-semibold mb-2">Tasks</h1>
          <div className="flex gap-4">
            <MainCards
              title="Pending"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#B23A48"
            />
            <MainCards
              title="In-progress"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#DCA74B"
            />
            <MainCards
              title="Completed"
              btn="View All"
              totaltasks={12}
              Icon={FaTasks}
              subtitle="Task"
              bgColor="#566E3D"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="grid grid-cols-1 mt-9 w-full gap-4">
          {/* Today's Tasks Section */}
          <MainCards
            title="Today's Tasks"
            btn="View All"
            totaltasks={12}
            Icon={FaTasks}
            subtitle="Task"
            bgColor="#7B4597"
          />
        </div>
      </section>
      <section className="bg-[#1A659E] h-96 rounded-xl"></section>
    </div>
  );
};

export default Dashboard;
