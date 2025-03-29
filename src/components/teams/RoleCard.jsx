/* eslint-disable react/prop-types */
const RoleCard = ({ role }) => {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="relative">
        <div className="flex justify-between relative">
          <div>
            <h3 className="font-bold text-black capitalize">{role.role}</h3>
            <p className="2xl:text-sm text-xs  text-white line-clamp-1">
              {role.tasksDetails}
            </p>
          </div>
          <span className="bg-slate-100 h-10 absolute right-0 w-10 inline-flex items-center justify-center rounded-full text-sm border">
            {role.count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
