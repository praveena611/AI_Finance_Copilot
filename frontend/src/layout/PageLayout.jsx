import { motion } from "framer-motion";

const pageAnimation = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export default function PageLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <motion.div
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      className="w-full max-w-[1440px] mx-auto min-h-screen p-6 text-white"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </motion.div>
  );
}