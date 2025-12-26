import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Beaker, FileText, Users, Activity, Settings, 
  Home, Calendar, ChartBar, LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LabLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname.includes('/signin') || location.pathname.includes('/signup');
  const token = localStorage.getItem('labToken');

  // Redirect to signin if not authenticated and not on auth pages
  React.useEffect(() => {
    if (!token && !isAuthPage) {
      navigate('/lab/signin');
    }
  }, [token, isAuthPage, navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('labToken');
    navigate('/lab/signin');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/lab/home' },
    { icon: Beaker, label: 'Tests', path: '/lab/tests' },
    { icon: FileText, label: 'Reports', path: '/lab/reports' },
    { icon: Users, label: 'Patients', path: '/lab/patients' },
    { icon: Calendar, label: 'Appointments', path: '/lab/appointments' },
    { icon: ChartBar, label: 'Analytics', path: '/lab/analytics' },
    { icon: Settings, label: 'Settings', path: '/lab/settings' },
  ];

  const sidebarVariants = {
    hidden: { x: -280 },
    visible: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  const iconVariants = {
    initial: { rotate: -20, scale: 0.9 },
    animate: { 
      rotate: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200
      }
    },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400 }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.4
      }
    }
  };

  if (isAuthPage) {
    return <Outlet />;
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Animated Sidebar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className="w-64 bg-white border-r shadow-sm flex flex-col justify-between"
      >
        {/* Top section with logo and navigation */}
        <div>
          <motion.div
            variants={headerVariants}
            className="p-6 border-b bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 relative overflow-hidden"
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
                backgroundSize: ['100% 100%', '200% 200%']
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)'
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-4">
                <motion.div
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm shadow-lg border border-white border-opacity-20"
                >
                  <Beaker className="w-7 h-7 text-white" />
                </motion.div>

                <motion.div
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  className="flex-1"
                >
                  <h1 className="text-xl font-bold text-white tracking-wide">
                    Laboratory
                  </h1>
                  <p className="text-sm text-purple-100 font-medium">
                    Management Panel
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-black bg-opacity-10 rounded-xl backdrop-blur-sm border border-white border-opacity-10"
              >
                <div className="flex justify-between items-center flex-col">
                  <div>
                    <p className="text-sm text-purple-100 font-medium">Central Laboratory</p>
                  </div>
                  <div className="text-right mt-1 flex items-center">
                    <p className="text-xs text-purple-200 opacity-80 mr-2">ID:</p>
                    <p className="text-sm text-purple-100 font-mono">LAB-2024-001</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <nav className="p-4">
            <motion.ul className="space-y-2">
              {navItems.map(({ icon: Icon, label, path }, index) => (
                <motion.li
                  key={path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-purple-50 text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
        </div>

        {/* Sign out button at bottom */}
        <div className="p-4 border-t">
          <motion.button
            onClick={handleSignOut}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Animated Main Content */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="flex-1 overflow-auto"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LabLayout;
