
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div 
      className="flex justify-center items-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}