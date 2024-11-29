import { FaTasks } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
/* eslint-disable react/prop-types */
const RoleCard = ({ role }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div className="flex justify-between relative">
          <div>
            <h3 className="font-bold text-white">{role.name}</h3>
            <p className="2xl:text-sm text-xs  text-white line-clamp-1">
              {role.tasksDetails}
            </p>
          </div>
          <span className="bg-slate-100 h-10 absolute right-0 w-10 inline-flex items-center justify-center rounded-full text-sm border">
            {role.totalPeople}
          </span>
        </div>
      </div>
      <ul className="flex gap-4">
        <li className="flex items-center gap-2 text-bg1">
          <FaTasks /> {role.tasksFinished}
        </li>
        <li className="flex items-center gap-2 text-bg1">
          <MdPendingActions /> {role.tasksPending}
        </li>
        <li className="flex items-center gap-2 text-bg1">
          <MdPendingActions /> {role.tasksPending}
        </li>
      </ul>
    </div>
  );
};

export default RoleCard;
