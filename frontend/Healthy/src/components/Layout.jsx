import React, { useState } from 'react';
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Hamburger Menu */}
      <button
        className="fixed top-4 left-4 md:hidden text-teal-600 z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar with animation */}
      <AnimatePresence>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </AnimatePresence>

      {/* Main Content with animation */}
      <motion.div 
        className="flex-1 md:ml-64 lg:ml-72 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="min-h-screen"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </motion.div>
    </div>
  );
}
