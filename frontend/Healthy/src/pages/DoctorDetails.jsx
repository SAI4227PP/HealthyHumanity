import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, Clock, Star, UserRound, Loader, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const DoctorDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = window.location;
  const hospitalId = new URLSearchParams(location.search).get('hospitalId');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    patientName: '',
    patientEmail: '',  // Added email field
    patientContact: '',
    appointmentDate: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitalId);

  // Define static slot
  const staticSlot = "Monday 10:00 -5:00";

  useEffect(() => {
    console.log('Fetching doctor details for id:', id);
    fetchDoctorDetails();
  }, [id]);

  useEffect(() => {
    console.log('Current hospital ID:', hospitalId); // Debug log
    setSelectedHospitalId(hospitalId);
  }, [hospitalId]);

  const fetchDoctorDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/doctors/${id}`);
      if (!response.ok) throw new Error('Doctor not found');
      const data = await response.json();
      console.log('Doctor details fetched:', data); // Debug log
      
      // Extract doctor data from the response
      const doctorData = data.doctor || data;
      console.log('Available slots:', doctorData.availableSlots); // Debug log
      setDoctor(doctorData);
    } catch (error) {
      toast.error('Failed to fetch doctor details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAppointmentDetails({
      ...appointmentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSlotSelection = (day, time) => {
    console.log('Slot selected:', day, time);
    const selectedDate = new Date(`${day} ${time}`);
    setAppointmentDetails({
      ...appointmentDetails,
      appointmentDate: selectedDate.toISOString().slice(0, 16), // Format as 'YYYY-MM-DDTHH:MM'
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    
    console.log('=== Booking Appointment ===');
    console.log('User details:', {
      isAuthenticated,
      userId: user?._id
    });

    if (!isAuthenticated || !user) {
      toast.error('Please log in to book an appointment');
      setBookingLoading(false);
      return;
    }

    try {
      // Make sure we're using the correct user ID field
      const appointmentData = {
        doctor: doctor._id,
        patient: user?._id || user?.id, // Try both possible ID fields
        patientName: appointmentDetails.patientName,
        patientContact: appointmentDetails.patientContact,
        patientEmail: appointmentDetails.patientEmail,
        appointmentDate: new Date(appointmentDetails.appointmentDate).toISOString(),
        consultationFee: doctor.consultationFee,
        status: 'Pending'
      };

      // Debug log to verify the data
      console.log('Patient ID check:', {
        userObject: user,
        userId: user?._id,
        userId2: user?.id,
        finalPatientId: appointmentData.patient
      });

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setBookingLoading(false);
        return;
      }

      console.log('Sending appointment data:', appointmentData);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Booking successful:', data);
        toast.success(data.message);
        setShowBookingForm(false); // Close the booking form on success
      } else {
        console.log('Booking failed:', data);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error booking appointment');
      console.error('Error:', error);
    } finally {
      setBookingLoading(false);
      console.log('Booking process finished.');
    }
  };

  const getLanguages = (languages) => {
    if (!languages || languages.length === 0 || (languages.length === 1 && languages[0] === '')) {
      return ['Telugu', 'English']; // Default languages
    }
    return languages;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const parseSlot = (slotString) => {
    try {
      if (!slotString) return null;
      
      // Match pattern like "Monday 10:00 -5:00"
      const parts = slotString.split(' ');
      if (parts.length === 3) {
        return {
          day: parts[0],
          startTime: parts[1],
          endTime: parts[2].startsWith('-') ? parts[2].substring(1) : parts[2]
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing slot:', error);
      return null;
    }
  };

  // Replace getAvailableSlots with a simpler function
  const getAvailableSlots = () => {
    return [staticSlot];
  };

  // Add this debug function
  useEffect(() => {
    if (doctor) {
      console.log('Available slots:', doctor.availableSlots);
      if (Array.isArray(doctor.availableSlots)) {
        doctor.availableSlots.forEach((slot, index) => {
          console.log(`Slot ${index}:`, slot);
          console.log('Parsed slot:', parseSlot(slot));
        });
      }
    }
  }, [doctor]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
          <Loader className="animate-spin w-6 h-6 text-teal-600" />
          <span className="ml-2 text-teal-700 font-medium">Loading...</span>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* 
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-teal-600 hover:text-teal-700 flex items-center"
      >
        ← Back to Hospital
      </button>
*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Header Section */}
        <div className="relative h-48 bg-teal-600">
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
            <h1 className="text-2xl font-bold text-white">Dr. {doctor.name}</h1>
            <div className="flex items-center text-white mt-2">
              <UserRound className="w-4 h-4 mr-2" />
              <span>{doctor.specialization}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Doctor Details */}
          <div className="flex items-center mb-6">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-32 h-32 rounded-full object-cover mr-4 border-4 border-teal-100"
              onError={(e) => {
                e.target.src = 'https://randomuser.me/api/portraits/lego/1.jpg'; // Fallback image
              }}
            />
            <div>
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-teal-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-500">Joined {formatDate(doctor.createdAt)}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{doctor.rating} Rating</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-1" />
                <span>{doctor.experience} Years Experience</span>
              </div>
            </div>

            <div className="flex items-center">
              <Globe className="w-4 h-4 text-gray-400 mr-1" />
              <span>{doctor.about}</span>
            </div>

            <div className="flex items-center">
              <Globe className="w-4 h-4 text-gray-400 mr-1" />
              <span>{doctor.qualifications.join(', ')}</span>
            </div>


            <div className="flex items-center">
              <Globe className="w-4 h-4 text-gray-400 mr-1" />
              <span>{getLanguages(doctor.languages).join(', ')}</span>
            </div>
            {doctor.contact?.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-1" />
                <span>{doctor.contact.phone}</span>
              </div>
            )}
            
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-teal-600">Consultation Fee</h3>
            <p className="text-xl font-semibold">₹{doctor.consultationFee}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-teal-600 mb-3">Available Slots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getAvailableSlots().map((slot, index) => {
                const parsed = parseSlot(slot);
                if (!parsed) return null;

                return (
                  <div
                    key={index}
                    className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg cursor-pointer 
                             transition-colors duration-200 border border-gray-200"
                    onClick={() => handleSlotSelection(parsed.day, `${parsed.startTime}-${parsed.endTime}`)}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <div>
                        <span className="font-medium text-gray-700">{parsed.day}</span>
                        <span className="ml-2 text-gray-500">
                          {`${parsed.startTime} -${parsed.endTime}`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <button
              className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700"
              onClick={() => setShowBookingForm(true)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </motion.div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
            <form onSubmit={handleBooking}>
              <div className="mb-4">
                <label className="block text-sm font-semibold">Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={appointmentDetails.patientName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  name="patientEmail"
                  value={appointmentDetails.patientEmail}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold">Contact</label>
                <input
                  type="text"
                  name="patientContact"
                  value={appointmentDetails.patientContact}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold">Appointment Date</label>
                <input
                  type="datetime-local"
                  name="appointmentDate"
                  value={appointmentDetails.appointmentDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;