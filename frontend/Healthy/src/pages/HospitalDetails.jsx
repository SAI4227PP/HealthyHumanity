import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, Clock, Star, Building, Stethoscope, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const HospitalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitalDetails();
    fetchHospitalDoctors();
  }, [id]);

  const fetchHospitalDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/hospital/${id}`);
      if (!response.ok) throw new Error('Hospital not found');
      const data = await response.json();
      setHospital(data);
    } catch (error) {
      toast.error('Failed to fetch hospital details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalDoctors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/doctors/hospital/${id}`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch hospital doctors');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading hospital details...</div>;
  }

  if (!hospital) {
    return <div className="p-4 text-center">Hospital not found</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-teal-600 hover:text-teal-700 flex items-center"
      >
        ← Back to Search
      </button>

      <motion.div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="relative h-48 bg-teal-600">
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
            <h1 className="text-2xl font-bold text-white">{hospital.hospitalName}</h1>
            <div className="flex items-center text-white mt-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{hospital.address}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Rating and Emergency Status */}
          <div className="flex items-center justify-between mb-6">
            {hospital.rating > 0 ? (
              <div className="flex items-center bg-teal-100 px-3 py-1 rounded-full">
                <Star className="w-5 h-5 text-teal-600 mr-1" />
                <span className="text-teal-800 font-semibold">{hospital.rating}</span>
              </div>
            ) : (
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-blue-800 font-semibold">New Hospital</span>
              </div>
            )}
            {hospital.emergencyServices && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                24/7 Emergency Services
              </span>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start">
              <Building className="w-5 h-5 text-teal-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-gray-600">{hospital.address}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-5 h-5 text-teal-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Contact</h3>
                <p className="text-gray-600">{hospital.phone}</p>
                <p className="text-gray-600">{hospital.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Globe className="w-5 h-5 text-teal-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Website</h3>
                <a
                  href={hospital.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  {hospital.website}
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-teal-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Working Hours</h3>
                <p className="text-gray-600">{`${hospital.openTime} - ${hospital.closeTime}`}</p>
                <p className="text-gray-500 text-sm">Timezone: {hospital.timezone}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-4 mb-6">
            {hospital.isVerified && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Verified Hospital
              </span>
            )}
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Status: {hospital.status}
            </span>
          </div>

          {/* Specialities */}
          {hospital.specialities && hospital.specialities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Stethoscope className="w-5 h-5 text-teal-600 mr-2" />
                Specialities
              </h3>
              <div className="flex flex-wrap gap-2">
                {hospital.specialities.map((spec, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Doctors Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <UserRound className="w-6 h-6 mr-2 text-teal-600" />
              Our Doctors
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <motion.div
                  key={doctor._id}
                  onClick={() => navigate(`/dashboard/doctor/${doctor._id}?hospitalId=${hospital._id}`)}
                  className="bg-white rounded-lg shadow-md p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                      onError={(e) => {
                        e.target.src = 'https://randomuser.me/api/portraits/lego/1.jpg'; // Fallback image
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{doctor.name}</h3>
                      <p className="text-teal-600">{doctor.specialization}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{doctor.rating} Rating</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span>{doctor.experience} Years Experience</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-1" />
                      <span>{doctor.languages.join(', ')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-semibold">₹{doctor.consultationFee}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availableSlots.map((slot, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {slot.day} {slot.time}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors"
                    onClick={() => navigate(`/dashboard/doctor/${doctor._id}?hospitalId=${hospital._id}`)}
                  >
                    Book Appointment
                  </button>
                </motion.div>
              ))}
            </div>

            {doctors.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No doctors found for this hospital
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors">
              Book Appointment
            </button>
            <button className="flex-1 border border-teal-600 text-teal-600 px-6 py-3 rounded-md hover:bg-teal-50 transition-colors">
              Get Directions
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HospitalDetails;
