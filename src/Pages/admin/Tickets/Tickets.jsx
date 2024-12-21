import { fetchAllTickets } from "@/API/admin/ticket/ticket_api";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import useAutoRefresh from "@/hooks/useAutoRefresh ";
import { CirclesWithBar } from "react-loader-spinner";
const Tickets = () => {
  const [priority, setPriority] = useState("all");
  const [ticketDetails, setTicketDetails] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: ticketDetailsFromAutoRefresh, loading } =
    useAutoRefresh(fetchAllTickets);

  useEffect(() => {
    const getTicket = async () => {
      try {
        const ticket = await fetchAllTickets();
        console.log(ticket.data);
        setTicketDetails(ticket.data);
      } catch (error) {
        console.error(error);
      }
    };
    getTicket();
  }, []);

  const optionVariants = {
    hidden: {
      opacity: 0,
      y: -10, // Start with the options above their final position
    },
    visible: {
      opacity: 1,
      y: 0, // Move to the final position
      transition: {
        opacity: { duration: 0.2 },
        y: { duration: 0.3 },
      },
    },
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const columns = [
    { key: "main_category", title: "Category" },
    { key: "subject", title: "Subject" },
    { key: "created_by", title: "Created by" },
    { key: "date", title: "Date" },
    { key: "status", title: "Status" },
    { key: "priority", title: "Priority" },
  ];

  const renderRow = (ticketDetails) => (
    <>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        <div className="font-bold text-primary">
          {ticketDetails.sub_category}
        </div>
        <div>{ticketDetails.main_category}</div>
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        <div className="font-bold">{ticketDetails.ticket_title}</div>
        <div>{ticketDetails.ticket_description}</div>
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        {ticketDetails.created_by}
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        {ticketDetails.created_date}
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            ticketDetails.status === "Open"
              ? "bg-red-100 text-red-600"
              : ticketDetails.status === "Closed"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {ticketDetails.status}
        </span>
      </td>
      <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            ticketDetails.priority === "Low"
              ? "bg-blue-100 text-blue-600"
              : ticketDetails.priority === "Regular"
              ? "bg-gray-100 text-gray-600"
              : ticketDetails.priority === "High"
              ? "bg-orange-100 text-orange-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {ticketDetails.priority}
        </span>
      </td>
    </>
  );

  return (
    <div>
      <div>
        <div className="flex items-center justify-between ">
          <div className="">
            <h1 className="2xl:text-lg font-semibold">All Tickets</h1>
          </div>
          <div className=" rounded-md relative">
            <label className="flex items-center 2xl:text-sm text-xs">
              Sort By :
              <div
                className="cursor-pointer flex items-center ml-2 bg-transparent font-semibold"
                onClick={toggleDropdown}
              >
                {priority === "all"
                  ? "Priority"
                  : priority.charAt(0).toUpperCase() + priority.slice(1)}
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDownIcon className="ml-2 w-4 h-4 text-gray-600" />
                </motion.div>
              </div>
            </label>
            {isDropdownOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      opacity: { duration: 0.2 },
                      staggerChildren: 0.1, // Stagger the children by 0.1s
                    },
                  },
                }}
                className="absolute left-0 top-8 w-full bg-white shadow-md rounded-md z-10"
              >
                <motion.div
                  className="flex flex-col"
                  initial="hidden"
                  animate="visible"
                >
                  {["all", "low", "regular", "high", "critical"].map(
                    (option) => (
                      <motion.div
                        key={option}
                        className="px-2 py-3 font-medium text-gray-800  2xl:text-sm text-xs cursor-pointer hover:bg-slate-100"
                        onClick={() => {
                          setPriority(option);
                          setIsDropdownOpen(false);
                        }}
                        variants={optionVariants}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </motion.div>
                    )
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center w-full h-full ">
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
            data={ticketDetailsFromAutoRefresh || ticketDetails}
            renderRow={renderRow}
          />
        )}
      </div>
    </div>
  );
};

export default Tickets;
