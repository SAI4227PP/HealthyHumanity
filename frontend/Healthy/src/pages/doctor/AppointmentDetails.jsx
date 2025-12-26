import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendar, FaClock, FaPhone, FaEnvelope, FaMoneyBill, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import toast from 'react-hot-toast';

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/appointments/${appointmentId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`,
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setAppointment(data.appointment);
      }
    } catch (error) {
      toast.error('Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/appointments/${appointmentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('doctorToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setAppointment(prev => ({ ...prev, status: newStatus }));
        toast.success(`Appointment marked as ${newStatus}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update appointment status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <MdPending className="w-5 h-5" />,
      },
      Confirmed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <FaCheckCircle className="w-5 h-5" />,
      },
      Completed: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <FaCheckCircle className="w-5 h-5" />,
      },
      Cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <FaTimesCircle className="w-5 h-5" />,
      },
    };

    const badge = badges[status] || badges.Pending;
    return (
      <div className={`flex items-center gap-2 ${badge.bg} ${badge.text} px-4 py-2 rounded-full w-fit`}>
        {badge.icon}
        <span className="font-medium">{status}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment not found</h2>
          <button
            onClick={() => navigate('/doctor/appointments')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Appointment Details</h1>
              <p className="text-gray-500 mt-1">Review and manage appointment information</p>
            </div>
            {getStatusBadge(appointment.status)}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/doctor/appointments')}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Appointments
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FaUser className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Patient Name</p>
                      <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FaPhone className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium text-gray-900">{appointment.patientContact}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FaEnvelope className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{appointment.patientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FaMoneyBill className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="font-medium text-gray-900">₹{appointment.consultationFee}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Timing */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Appointment Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaCalendar className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaClock className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Update Status</h2>
            <div className="space-y-4">
              {/* Show Confirm button only if status is Pending */}
              {appointment.status === 'Pending' && (
                <button
                  onClick={() => updateAppointmentStatus('Confirmed')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaCheckCircle className="w-5 h-5" />
                  Confirm Appointment
                </button>
              )}
              
              {/* Show Complete button only if status is Confirmed */}
              {appointment.status === 'Confirmed' && (
                <button
                  onClick={() => updateAppointmentStatus('Completed')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaCheckCircle className="w-5 h-5" />
                  Mark as Completed
                </button>
              )}
              
              {/* Show Cancel button only if status is Pending */}
              {appointment.status === 'Pending' && (
                <button
                  onClick={() => updateAppointmentStatus('Cancelled')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaTimesCircle className="w-5 h-5" />
                  Cancel Appointment
                </button>
              )}

              {/* Show status message if appointment is already Completed or Cancelled */}
              {(appointment.status === 'Completed' || appointment.status === 'Cancelled') && (
                <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                  This appointment has been {appointment.status.toLowerCase()} and cannot be modified
                </div>
              )}
            </div>

            {updating && (
              <div className="mt-4 text-center text-gray-500">
                Updating status...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
