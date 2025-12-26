import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Search,
  User,
  Heart,
  FileText,
  Hospital,
  LogOut,
  BrainCircuit,
  X,
  Microscope,  // Add this import
} from "lucide-react";
import logo from '../assets/logo.webp'; // Adjust the path based on your directory structure


export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onClose) onClose();
  };

  const handleNavigation = (path) => {
    switch(path) {
      case 'home':
        navigate('/dashboard/home');
        break;
      case 'reports':
        navigate('/dashboard/my-reports');
        break;
      case 'medicines':
        navigate('/dashboard/medicines-used');
        break;
      case 'hospital-search':
        navigate('/dashboard/hospital-search');
        break;
      case 'appointments':
        navigate('/dashboard/appointments');
        break;  
      case 'tests':
        navigate('/dashboard/tests');
        break;
      case 'ai-assistant':
        navigate('/dashboard/ai-assistant');
        break;
      case 'report-analysis':
        navigate('/dashboard/report-analysis');
        break;
      default:
        break;
    }
    if (onClose) onClose();
  };

  // Function to check if route is active
  const isActiveRoute = (path) => {
    switch(path) {
      case 'home':
        return location.pathname === '/dashboard/home';
      case 'reports':
        return location.pathname === '/dashboard/my-reports';
      case 'medicines':
        return location.pathname === '/dashboard/medicines-used';
      case 'hospital-search':
        return location.pathname === '/dashboard/hospital-search';
      case 'tests':
        return location.pathname === '/dashboard/tests';
      case 'appointments':
        return location.pathname === '/dashboard/appointments';
      case 'ai-assistant':
        return location.pathname === '/dashboard/ai-assistant';
      case 'report-analysis':
        return location.pathname === '/dashboard/report-analysis';
      default:
        return false;
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-teal-600 text-white flex flex-col py-6
        ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full'} 
        transition-all duration-300 
        md:translate-x-0 md:w-64 lg:w-72
        shadow-lg z-40`}
    >
      {isOpen && (
        <button
          onClick={onClose}
          className="text-white mb-4 md:hidden self-end mr-4"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <img
        src={logo}
        alt="Logo"
        className="mb-6 rounded-full w-24 h-24 hidden md:block mx-auto"
      />
      <nav className="flex flex-col space-y-5 px-6">
        <SidebarItem 
          Icon={User} 
          label="Home" 
          onClick={() => handleNavigation('home')}
          isActive={isActiveRoute('home')}
        />
        <SidebarItem 
          Icon={FileText} 
          label="My Reports"
          onClick={() => handleNavigation('reports')}
          isActive={isActiveRoute('reports')}
        />
        <SidebarItem 
          Icon={Heart} 
          label="Medicines Used"
          onClick={() => handleNavigation('medicines')}
          isActive={isActiveRoute('medicines')}
        />
        <SidebarItem 
          Icon={FileText} 
          label="Lab Tests" 
          onClick={() => handleNavigation('tests')}
          isActive={isActiveRoute('tests')}
        />
        <SidebarItem
         Icon={Hospital}
          label="Appointments"
         onClick={() => handleNavigation('appointments')}
         isActive={isActiveRoute('appointments')} />
        <SidebarItem 
          Icon={Search} 
          label="Hospital Search"
          onClick={() => handleNavigation('hospital-search')}
          isActive={isActiveRoute('hospital-search')}
        />
        <SidebarItem 
          Icon={Microscope}
          label="Report Analysis"
          onClick={() => handleNavigation('report-analysis')}
          isActive={isActiveRoute('report-analysis')}
        />
        <SidebarItem 
          Icon={BrainCircuit} 
          label="AI Assistant"
          onClick={() => handleNavigation('ai-assistant')}
          isActive={isActiveRoute('ai-assistant')}
        />
        <SidebarItem 
          Icon={LogOut} 
          label="Log Out" 
          onClick={handleLogout}
          isActive={false}
        />
      </nav>
    </div>
  );
}

function SidebarItem({ Icon, label, onClick, isActive }) {
  return (
    <div 
      className={`flex items-center py-2 px-4 rounded-lg cursor-pointer transition-colors
        ${isActive 
          ? 'bg-teal-700 text-white font-semibold' 
          : 'hover:bg-teal-700/50 text-white/90'
        }`}
      onClick={onClick}
    >
      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-teal-200' : ''}`} />
      <span className="text-sm md:text-base lg:text-lg font-medium">
        {label}
      </span>
    </div>
  );
}
