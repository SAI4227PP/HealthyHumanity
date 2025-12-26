import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Calendar, 
  Activity, 
  Utensils, 
  Video,
  Phone, 
  Syringe,
  BookOpen,
  User,
  Hospital,
   Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/timeUtils';
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/reminders`);
      const data = await response.json();
      setReminders(data.slice(0, 4)); // Only show latest 4 reminders
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token for auth
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/appointments/my-appointments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const text = await response.text(); // Get raw response
  
        const data = JSON.parse(text); // Try parsing manually
  
        if (!response.ok || !data.appointments) {
          throw new Error(data.message || 'Failed to fetch appointments');
        }
        setAppointments(data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } 
    };
  
    useEffect(() => {
      fetchAppointments();
    }, []);
  
  

  const handleQuickAction = (action) => {
    switch(action) {
      case 'medication-reminders':
        navigate('/dashboard/medication-reminders');
        break;
      case 'teleconsult':
        navigate('/dashboard/teleconsult');
        break;
      case 'emergency':
        navigate('/dashboard/emergency');
        break;
      case 'schedule-test':
        navigate('/dashboard/schedule-test');
        break;
      default:
        break;
    }
  };

  const handleSectionClick = (path) => {
    navigate(`/dashboard/${path}`);
  };

  const getNextReminder = (reminders) => {
    if (!reminders || reminders.length === 0) return "No upcoming medications";
    
    // Sort reminders by time
    const sortedReminders = [...reminders].sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`);
      const timeB = new Date(`1970/01/01 ${b.time}`);
      return timeA - timeB;
    });

    // Get current time
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Find next reminder
    const nextReminder = sortedReminders.find(reminder => {
      const [hours, minutes] = reminder.time.split(':');
      const reminderTime = parseInt(hours) * 60 + parseInt(minutes);
      return reminderTime > currentTime;
    }) || sortedReminders[0]; // If no upcoming today, show first of next day

    return nextReminder 
      ? `Next: ${nextReminder.medicine} at ${formatTime(nextReminder.time)}`
      : "No upcoming medications";
  };

  return (
    <div className="p-4 md:p-6">
      {/* Welcome Section */}
      <motion.div 
      initial={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      >
      <div className="flex flex-col md:flex-row items-center bg-white p-4 shadow-lg rounded-lg mb-4">
        <img
          src={user?.avatar || 'https://th.bing.com/th/id/OIP.yd94h9eJxZuHPrDg31LkiQHaHa?w=500&h=500&rs=1&pid=ImgDetMain'}
          alt="Profile Picture"
          className="w-12 h-12 md:w-20 md:h-20 rounded-full mb-4 md:mb-0 object-cover"
        />
        <h1 className="text-xl md:text-2xl font-bold text-teal-700 md:ml-6 text-center md:text-left">
          Welcome {user?.name || 'Guest'}!
        </h1>
      </div>
      </motion.div>
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <QuickAction 
          icon={<Bell />} 
          title="Medication Reminders" 
          subtitle={getNextReminder(reminders)}
          index={0}
          onClick={() => handleQuickAction('medication-reminders')}
        />
        <QuickAction 
          icon={<Video />} 
          title="Teleconsult" 
          subtitle="Book video consultation"
          index={1}
          onClick={() => handleQuickAction('teleconsult')}
        />
        <QuickAction 
          icon={<Phone />} 
          title="Emergency" 
          subtitle="Quick access to help"
          index={2}
          onClick={() => handleQuickAction('emergency')}
        />
        <QuickAction 
          icon={<Calendar />} 
          title="Schedule Test" 
          subtitle="Book lab tests"
          index={3}
          onClick={() => handleQuickAction('schedule-test')}
        />
      </div>

      {/* Health Metrics Dashboard */}
      <div 
        className="bg-white shadow-lg rounded-lg p-4 mb-6 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => handleSectionClick('health-metrics')}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="mr-2 text-teal-600" />
          Health Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Steps" value="7,543" target="10,000" index={0} />
          <MetricCard title="Heart Rate" value="72" unit="bpm" index={1} />
          <MetricCard title="Sleep" value="7.2" unit="hours" index={2} />
          <MetricCard title="Water" value="6" unit="glasses" index={3} />
        </div>
      </div>

      {/* Diet & Exercise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div 
          className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleSectionClick('diet-plan')}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Utensils className="mr-2 text-teal-600" />
            Today's Diet Plan
          </h2>
          {/* Add diet tracking component */}
        </div>
        <div 
          className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleSectionClick('exercise-log')}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-teal-600" />
            Exercise Log
          </h2>
          {/* Add exercise tracking component */}
        </div>
      </div>

      {/* Vaccination Tracker */}
      <div 
        className="bg-white shadow-lg rounded-lg p-4 mb-6 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => handleSectionClick('vaccination-schedule')}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Syringe className="mr-2 text-teal-600" />
          Vaccination Schedule
        </h2>
        {/* Add vaccination tracking component */}
      </div>

      {/* Health Articles */}
      <div 
        className="bg-white shadow-lg rounded-lg p-4 mb-6 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => handleSectionClick('health-articles')}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BookOpen className="mr-2 text-teal-600" />
          Health Tips & Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Add article cards */}
        </div>
      </div>

      {/* Health Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Health Profile Section - Updated */}
        <motion.div 
          className="bg-white shadow-lg rounded-lg p-6 order-2 cursor-pointer"
          onClick={() => navigate('/dashboard/health-profile')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="mr-2 text-teal-600" />
              Health Profile
            </h2>
            <span className="text-teal-600">View Details →</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="font-semibold text-lg">A+</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Blood Pressure</p>
              <p className="font-semibold text-lg">120/80</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Sugar Level</p>
              <p className="font-semibold text-lg">80</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Pulse Rate</p>
              <p className="font-semibold text-lg">80</p>
            </div>
          </div>
        </motion.div>

        {/* Updated Medicines Section */}
        <motion.div 
          className="bg-white shadow-lg rounded-lg p-4 order-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Currently Using Medicines:</h2>
            <button 
              onClick={() => navigate('/dashboard/medication-reminders')}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-md text-gray-700 space-y-3">
            {reminders.length > 0 ? (
              reminders.map((reminder) => (
                <motion.div 
                  key={reminder._id}
                  className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <p className="font-medium">{reminder.medicine}</p>
                    <p className="text-sm text-gray-500">
                      {formatTime(reminder.time)} • {reminder.frequency}
                    </p>
                  </div>
                  <Bell className="text-teal-600 w-4 h-4" />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-2">No medications added</p>
            )}
          </div>
          <button 
            onClick={() => navigate('/dashboard/medication-reminders')}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 w-full sm:w-auto"
          >
            Manage Medicines
          </button>
        </motion.div>
      </div>

      {/* Appointments Section - Updated Design */}
      <motion.div 
        className="bg-white shadow-lg rounded-lg p-6 mb-6 cursor-pointer"
        onClick={() => navigate('/dashboard/appointments')}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Calendar className="mr-2 text-teal-600" />
            Your Next Appointment
          </h2>
          <button className="text-teal-600 hover:text-teal-700">
            View All →
          </button>
        </div>
        <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <User className="w-6 h-6 text-teal-600 p-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{appointment.doctor?.name || 'Unknown Doctor'}</h3>
                    <div className="flex items-center text-gray-600">
                      <Hospital className="w-6 h-6 mr-1 p-1" />
                      <span>{appointment.doctor?.hospitalId?.name || 'Unknown Hospital'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1 p-1" />
                    <span>{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Clock className="w-4 h-4 mr-1 p-1" />
                    <span>{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    {appointment.type === 'Video' ? (
                      <button className="flex items-center text-teal-600 hover:text-teal-700">
                        <Video className="w-5 h-5 mr-1 p-1" />
                        Join Call
                      </button>
                    ) : (
                      <span className="text-teal-600">{appointment.type || 'In-person'}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 border-2 border-dashed border-teal-200 p-6 rounded-lg bg-teal-50 mb-6">
            <p className="text-lg font-semibold">📅 No upcoming appointments.</p>
            <p className="text-sm">Book a new appointment to see your schedule.</p>
          </div>
        )}
      </div>
      </motion.div>

      {/* Hospital Search Section */}
      <div 
        className="bg-white shadow-lg rounded-lg p-4 cursor-pointer"
        onClick={() => navigate('/dashboard/hospital-search')}
      >
        <h2 className="text-xl font-semibold mb-4">Search Hospitals:</h2>
        <div className="flex items-center bg-gray-100 p-2 rounded-md mb-4">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Hospitals"
            className="w-full bg-transparent border-none outline-none ml-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select className="bg-gray-100 p-2 rounded-md">
            <option>Problem</option>
          </select>
          <select className="bg-gray-100 p-2 rounded-md">
            <option>Area</option>
          </select>
        </div>
        <button className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 w-full">
          Search Best Hospitals
        </button>
      </div>
    </div>
  );
}

// Helper Components
function QuickAction({ icon, title, subtitle, index, onClick }) {
  return (
    <motion.div 
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="text-teal-600 mb-2"
        whileHover={{ rotate: 5 }}
      >
        {icon}
      </motion.div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </motion.div>
  );
}

function MetricCard({ title, value, unit, target, index }) {
  return (
    <motion.div 
      className="bg-gray-50 p-4 rounded-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <h4 className="text-sm text-gray-600">{title}</h4>
      <div className="text-xl font-bold text-teal-700">
        {value}
        <span className="text-sm font-normal text-gray-600 ml-1">{unit}</span>
      </div>
      {target && (
        <div className="text-xs text-gray-500">
          Target: {target}
        </div>
      )}
    </motion.div>
  );
}
