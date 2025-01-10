/* eslint-disable react/prop-types */
import { Link } from "react-router"; // Correct import
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function MainCards({
  title,
  btn,
  totaltasks,
  Icon,
  subtitle,
  path,
  bgColor,
  onClick,
}) {
  const count = useMotionValue(0); // Initialize motion value
  const roundedCount = useTransform(count, (value) => Math.round(value)); // Transform count to rounded values
  const [displayCount, setDisplayCount] = useState(0); // State to display count

  useEffect(() => {
    // Animate the count value using `animate` function
    const animation = animate(count, totaltasks, {
      duration: 1.5,
      ease: "easeInOut",
    });

    // Subscribe to updates and update the displayed count
    const unsubscribe = roundedCount.on("change", (latest) => {
      setDisplayCount(latest); // Update the state for rendering
    });

    return () => {
      animation.stop(); // Cleanup animation
      unsubscribe(); // Unsubscribe from updates
    };
  }, [count, roundedCount, totaltasks]); // Dependencies

  const cardContent = (
    <div
      className="w-full text-white p-6 rounded-xl flex flex-col gap-8 hover:shadow-xl"
      style={{ backgroundColor: bgColor || "#f8f9fa" }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-end justify-between">
        <h3 className="text-xl">{title}</h3>
        <p className="text-sm">{btn}</p>
      </div>

      {/* Content */}
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-2">
          {/* Display animated count */}
          <motion.h4 className="text-2xl">{displayCount}</motion.h4>
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
