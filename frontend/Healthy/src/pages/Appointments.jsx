import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Hospital, Plus, Video, AlertCircle, RefreshCcw, Loader, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'; // Importing the toast function
import { useAuth } from '../contexts/AuthContext'; // Add this import
import 'react-toastify/dist/ReactToastify.css'; // Importing the styles



export default function Appointments() {
  const { user, isAuthenticated } = useAuth(); // Add this line
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated || !user) {
      setError('Please log in to view appointments');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Debug logs to verify user ID
      console.log('Auth check:', {
        token: !!token,
        userId: user._id,
        user: user
      });

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/appointments/my-appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Appointments response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/appointments/cancel/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        // Filter out the canceled appointment from the state
        setAppointments(appointments.filter(appointment => appointment._id !== appointmentId));
        toast.success(data.message || 'Appointment canceled successfully'); // Friendly success message
      } else {
        toast.error(data.message || 'Failed to cancel appointment'); // Friendly error message
      }
    } catch (error) {
      toast.error('Error canceling appointment'); // Error message
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2">
        <Loader className="animate-spin w-6 h-6 text-teal-600" />
        <span className="ml-2 text-teal-700 font-medium">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <AlertCircle className="inline-block w-6 h-6 mr-2" />
        <span>{error}</span>
        <button 
          onClick={fetchAppointments} 
          className="ml-4 text-teal-600 hover:underline flex items-center"
        >
          <RefreshCcw className="w-4 h-4 mr-1" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-700 flex items-center pl-9 sm:pl-0">
          <Calendar className="mr-2 p-0" />
          Your Appointments
        </h1>
        {appointments.length === 0 && (
          <div className="flex items-center space-x-2">
            <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center">
              <Plus className="w-5 h-5 mr-2 p-1" />
              Book Appointment
            </button>
          </div>
        )}
      </div>

      {/* Appointments List */}
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
                      <span>{appointment.doctor?.hospitalId?.name || 'AIIMS Hospital'}</span>
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

                  {/* Appointment Status */}
                  <div className="mt-2">
                    <span className={`text-base font-semibold ${
                      appointment.status === 'Confirmed' 
                        ? 'text-blue-600' 
                        : appointment.status === 'Pending' 
                        ? 'text-orange-600' 
                        : appointment.status === 'Completed'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      Status: {appointment.status || 'Unknown'}
                    </span>
                  </div>

                  {/* Cancel Button - Only show for Pending appointments */}
                  {appointment.status === 'Pending' && (
                    <button
                      onClick={() => cancelAppointment(appointment._id)}
                      className="mt-2 text-red-600 hover:text-red-700 flex items-center"
                    >
                      <XCircle className="w-5 h-5 mr-1" />
                      Cancel Appointment
                    </button>
                  )}

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
    </div>
  );
}
