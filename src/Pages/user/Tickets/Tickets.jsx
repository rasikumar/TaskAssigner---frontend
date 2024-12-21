import { fetchAllTickets } from "@/API/admin/ticket/ticket_api";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Tickets = () => {
  const [priority, setPriority] = useState("all");
  const [ticketDetails, setTicketDetails] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  return (
    <div className="">
      <div>
        <div className="flex items-center justify-between w-full px-4 mt-4">
          <div className="mt-3">
            <h1 className="2xl:text-lg font-semibold">All Tickets</h1>
          </div>
          <div className="bg-slate-200 mt-6 rounded-md relative">
            <label className="flex items-center px-3 py-2 2xl:text-sm text-xs">
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

        <table className="table-auto border-collapse w-full mt-4 m-auto text-xs shadow-md rounded-lg overflow-hidden bg-white">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-2 py-3 text-sm  text-left font-semibold">
                Category
              </th>
              <th className="px-2 py-3 text-sm  text-left font-semibold">
                Subject
              </th>
              <th className="px-2 py-3 text-sm  text-left font-semibold">
                Created by
              </th>
              <th className="px-2 py-3 text-sm  text-left font-semibold">
                Date
              </th>
              <th className="px-2 py-3 text-sm  text-left font-semibold">
                Status
              </th>
              <th className="px-2 py-3 text-sm  text-left font-semibold">
                Priority
              </th>
            </tr>
          </thead>
          <tbody>
            {ticketDetails.map((ticket, index) => (
              <tr
                key={ticket.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
                  <div className="font-bold text-primary">
                    {ticket.sub_category}
                  </div>
                  <div>{ticket.main_category}</div>
                </td>
                <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
                  <div className="font-bold">{ticket.ticket_title}</div>
                  <div>{ticket.ticket_description}</div>
                </td>
                <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
                  {ticket.created_by}
                </td>
                <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
                  {ticket.created_date}
                </td>
                <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === "Open"
                        ? "bg-red-100 text-red-600"
                        : ticket.status === "Closed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-2 py-3 text-sm font-medium text-gray-800 ">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ticket.priority === "Low"
                        ? "bg-blue-100 text-blue-600"
                        : ticket.priority === "Regular"
                        ? "bg-gray-100 text-gray-600"
                        : ticket.priority === "High"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tickets;
