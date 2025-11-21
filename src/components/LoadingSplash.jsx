import React from "react";
import { motion } from "framer-motion";

export default function LoadingSplash() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#1f2335] z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        {/* Logo Circle */}
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
          W
        </div>
        {/* Company Name */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-gray-900 dark:text-[#e0e6f0]"
        >
          Webworks by Arnav
        </motion.h2>
        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 dark:text-[#a1accd] mt-2"
        >
          Loading dashboard...
        </motion.p>
      </motion.div>
    </div>
  );
}
