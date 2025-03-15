/* eslint-disable react/prop-types */
import { Link } from "react-router"; // ✅ Corrected import
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function MainCards({
  title,
  btn,
  totaltasks = 0, // ✅ Ensure it's a number
  Icon,
  subtitle,
  path,
  bgColor,
  onClick,
}) {
  const count = useMotionValue(0); // ✅ Motion value for animation
  const roundedCount = useTransform(count, (value) => Math.round(value)); // ✅ Round values for smooth animation
  const [displayCount, setDisplayCount] = useState(0); // ✅ State to display count

  useEffect(() => {
    if (typeof totaltasks !== "number") return; // ✅ Prevent animation if totaltasks is invalid

    // ✅ Animate the count value correctly
    const animation = animate(count, totaltasks, {
      duration: 1.5,
      ease: "easeInOut",
    });

    // ✅ Subscribe to rounded count updates
    const unsubscribe = roundedCount.on("change", (latest) => {
      setDisplayCount(latest);
    });

    return () => {
      animation.stop(); // ✅ Cleanup animation on unmount
      unsubscribe(); // ✅ Unsubscribe from updates
    };
  }, [totaltasks]); // ✅ Re-run effect only when `totaltasks` changes

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
          {/* ✅ Display animated count */}
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
