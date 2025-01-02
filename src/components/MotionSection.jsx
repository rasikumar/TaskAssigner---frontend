/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

// Reusable motion component with default values for animation and support for Tailwind CSS className
const MotionSection = ({
  children,
  initial = { opacity: 0, x: -100 }, // Default initial state
  whileInView = { opacity: 1, x: 0 }, // Default when in view
  transition = { duration: 1 }, // Default transition
  viewport = { once: true }, // Default viewport behavior
  className = "", // Default empty string for className
}) => {
  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      transition={transition}
      viewport={viewport}
      className={className} // Apply the className prop to the motion div
    >
      {children}
    </motion.div>
  );
};

export default MotionSection;
