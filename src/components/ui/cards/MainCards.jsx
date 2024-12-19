/* eslint-disable react/prop-types */
import { Link } from "react-router"; // Import Link from react-router-dom

export default function MainCards({
  title,
  subtitle,
  btn,
  totaltasks,
  Icon,
  bgColor,
  path,
}) {
  const cardContent = (
    <div
      className="w-full text-white p-6 rounded-xl flex flex-col gap-8"
      style={{ backgroundColor: bgColor || "#f8f9fa" }}
    >
      <div className="flex items-end justify-between">
        <h3 className="2xl:text-2xl text-xl">{title}</h3>
        <p>{btn}</p>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-2">
          <h4 className="text-2xl">{totaltasks}</h4>
          <p>{subtitle}</p>
        </div>
        <div>
          <Icon className="-mt-5" />
        </div>
      </div>
    </div>
  );

  return path ? (
    <Link to={path} style={{ textDecoration: "none" }}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
