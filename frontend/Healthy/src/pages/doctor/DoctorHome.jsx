import React, { useState, useEffect } from 'react';
import { FaUserInjured, FaCalendarCheck, FaClock, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDoctor } from '../../context/DoctorContext';
import toast from 'react-hot-toast';

const DoctorHome = () => {
  const navigate = useNavigate();
  const { doctor } = useDoctor();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingReports: 0,
    totalConsultations: 0
  });
  const [loading, setLoading] = useState(true);

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    if (doctor?.id) {
      fetchAppointments();
    }
  }, [doctor]);

  const fetchAppointments = async () => {
    try {
      console.log('Fetching appointments for doctor ID:', doctor.id);
      
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/appointments/doctor/${doctor.id}`, // Updated URLd}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Appointments data:', data);

      if (data.success) {
        // Sort upcoming appointments
        const upcomingAppointments = data.appointments
          .filter(apt => new Date(apt.appointmentDate) >= new Date())
          .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

        setAppointments(upcomingAppointments);

        // Update stats
        setStats({
          totalPatients: new Set(data.appointments.map(apt => apt.patientEmail)).size,
          todayAppointments: data.appointments.filter(apt => {
            const aptDate = new Date(apt.appointmentDate).setHours(0,0,0,0);
            const today = new Date().setHours(0,0,0,0);
            return aptDate === today;
          }).length,
          pendingReports: data.appointments.filter(apt => apt.status === 'Pending').length,
          totalConsultations: data.appointments.length
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAppointmentTime = (date) => {
    const appointmentDate = new Date(date);
    const now = new Date();
    const diffHours = Math.round((appointmentDate - now) / (1000 * 60 * 60));
    
    return {
      time: appointmentDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      relative: diffHours > 24 
        ? appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : diffHours <= 0 
          ? 'Now'
          : `In ${diffHours} hours`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, Dr. {doctor?.name?.split(' ')[0] || 'Doctor'}
          </h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + New Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Patients Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaUserInjured className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Patients</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalPatients}</h3>
            </div>
          </div>
        </div>

        {/* Today's Appointments Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-200" 
             onClick={() => navigate('/doctor/appointments')}>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCalendarCheck className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Today's Appointments</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.todayAppointments}</h3>
            </div>
          </div>
        </div>

        {/* Pending Reports Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaClock className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Pending Reports</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.pendingReports}</h3>
            </div>
          </div>
        </div>

        {/* Total Consultations Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FaChartLine className="text-orange-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Consultations</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalConsultations}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p>No upcoming appointments</p>
            ) : (
              appointments.map((appointment) => {
                const timing = formatAppointmentTime(appointment.appointmentDate);
                return (
                  <div key={appointment._id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">{appointment.patientName}</h4>
                      <p className="text-sm text-gray-500">{appointment.patientEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{timing.time}</p>
                      <p className="text-sm text-gray-500">{timing.relative}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activity */} 
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-800 font-medium">Report uploaded for Patient #1234</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
