import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { useDoctor } from '../../context/DoctorContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
  const [filter, setFilter] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { doctor } = useDoctor();
  const navigate = useNavigate();

  useEffect(() => {
    if (doctor?.id) {
      fetchAppointments();
    }
  }, [doctor]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/appointments/doctor/${doctor.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/appointments/cancel/${appointmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      toast.success('Appointment cancelled successfully');
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleViewDetails = (appointmentId) => {
    navigate(`/doctor/appointments/${appointmentId}`);
  };

  // Filter appointments based on status and search term
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Determine if appointment is upcoming, today, or past
    const isUpcoming = appointmentDate >= today;
    const isPast = appointmentDate < today;
    const isToday = appointmentDate.toDateString() === today.toDateString();

    // Match filter conditions
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'upcoming' && isUpcoming && !isToday) || 
      (filter === 'today' && isToday) ||
      (filter === 'completed' && isPast) ||
      (filter === 'cancelled' && appointment.status === 'cancelled');

    // Match search term
    const matchesSearch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-orange-100 text-orange-800',    // Orange for pending
      confirmed: 'bg-blue-100 text-blue-800',      // Blue for confirmed
      completed: 'bg-green-100 text-green-800',    // Green for completed
      cancelled: 'bg-red-100 text-red-800'         // Red for cancelled
    };
    const icons = {
      pending: <FaClock className="inline mr-1" />,
      confirmed: <FaClock className="inline mr-1" />,
      completed: <FaCheckCircle className="inline mr-1" />,
      cancelled: <FaTimesCircle className="inline mr-1" />
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm flex items-center w-fit ${badges[status.toLowerCase()]}`}>
        {icons[status.toLowerCase()]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Today's Appointments</h1>
        <p className="text-gray-600">Manage your appointments for today</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg ${filter === 'today' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg ${filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Cancelled
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => {
                const { date, time } = formatDateTime(appointment.appointmentDate);
                return (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.patientContact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{time}</div>
                      <div className="text-sm text-gray-500">{date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Consultation
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(appointment._id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Details
                      </button>
                      {appointment.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;
