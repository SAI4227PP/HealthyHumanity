import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Stethoscope, 
  Calendar, 
  Box, 
  DollarSign, 
  FileText, 
  UserPlus,
  Settings,
  Activity,
  LogOut
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

const HospitalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hospitalContext = useHospital();
  
  // Early return if context is not available
  if (!hospitalContext) {
    console.error('Hospital context not found');
    return null;
  }

  const { logout, isAuthenticated } = hospitalContext;
  const isAuthPage = location.pathname.includes('/signin') || location.pathname.includes('/signup');

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (isAuthenticated && isAuthPage) {
      navigate('/hospital/home');
    }
  }, [isAuthenticated, isAuthPage, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/hospital/signin');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/hospital/home' },
    { icon: Users, label: 'Patients', path: '/hospital/patients' },
    { icon: Stethoscope, label: 'Doctors', path: '/hospital/doctors' }, // Updated path
    { icon: DollarSign, label: 'Billing', path: '/hospital/billing' },
    { icon: FileText, label: 'Reports', path: '/hospital/reports' },
    { icon: UserPlus, label: 'Staff', path: '/hospital/staff' },
    { icon: Settings, label: 'Settings', path: '/hospital/settings' }
  ];

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-teal-600">Hospital Admin</h1>
        </div>
        <nav className="p-4 flex-grow">
          <ul className="space-y-2">
            {navItems.map(({ icon: Icon, label, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {isAuthenticated && (
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default HospitalLayout;
