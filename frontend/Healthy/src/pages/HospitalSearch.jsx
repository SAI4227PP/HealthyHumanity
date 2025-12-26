import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Star, Clock, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HospitalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async (filters = {}) => {
    try {
      setLoading(true);
      let endpoint = `${import.meta.env.VITE_BASE_URL}/api/hospital`;
      
      // If any filters are active, use the search endpoint
      if (filters.search || filters.location || filters.speciality) {
        endpoint += '/search';
        const queryParams = new URLSearchParams({
          name: filters.search || searchTerm,
          location: filters.location || location,
          status: 'active' // Add status filter if needed
        }).toString();
        endpoint += `?${queryParams}`;
      } else {
        endpoint += '/all'; // Use the /all endpoint when no filters are active
      }

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch hospitals');
      
      const data = await response.json();
      setHospitals(data.hospitals || []); // Access the hospitals array from the response
    } catch (error) {
      toast.error('Failed to fetch hospitals');
      console.error('Error:', error);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHospitals({ search: searchTerm, location, speciality });
  };

  const handleViewDetails = (hospitalId) => {
    navigate(`/dashboard/hospital/${hospitalId}`);
  };

  const specialities = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Oncology',
    'Emergency',
    'Pediatrics',
    'Gynecology'
  ];

  const getDefaultSpecialities = () => [
    'General Medicine',
    'Emergency Care',
    'Primary Care'
  ];

  const getRatingDisplay = (rating) => {
    if (rating === 0 || rating === null) {
      return (
        <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
          <span className="text-blue-800 text-sm font-medium">New</span>
        </div>
      );
    }
    return (
      <div className="flex items-center bg-teal-100 px-2 py-1 rounded">
        <Star className="w-4 h-4 text-teal-600 mr-1" />
        <span className="text-teal-800">{rating}</span>
      </div>
    );
  };

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
      <h1 className="text-2xl font-bold text-teal-700 mb-6 pl-9 sm:pl-0">Find Hospitals</h1>

      {/* Search Section */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center bg-gray-100 p-2 rounded-md">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search hospitals..."
              className="w-full bg-transparent border-none outline-none ml-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-gray-100 p-2 rounded-md"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
          >
            <option value="">All Specialities</option>
            {specialities.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <div className="flex items-center bg-gray-100 p-2 rounded-md">
            <MapPin className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter location"
              className="w-full bg-transparent border-none outline-none ml-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full md:w-auto bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700"
        >
          Search Hospitals
        </button>
      </form>

      {/* Results */}
      <div className="grid gap-4">
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <motion.div
              key={hospital._id}
              onClick={() => handleViewDetails(hospital._id)}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{hospital.hospitalName}</h2>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{hospital.address}</span>
                  </div>
                </div>
                {getRatingDisplay(hospital.rating)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{`${hospital.openTime} - ${hospital.closeTime}`}</span>
                </div>
                {hospital.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{hospital.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(!hospital.specialities || hospital.specialities.length === 0) ? (
                  getDefaultSpecialities().map((spec, index) => (
                    <span
                      key={index}
                      className="bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-sm border border-gray-200"
                    >
                      {spec}
                    </span>
                  ))
                ) : (
                  hospital.specialities.map((spec, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))
                )}
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                  Book Appointment
                </button>
                <button 
                  className="border border-teal-600 text-teal-600 px-4 py-2 rounded-md hover:bg-teal-50"
                  onClick={() => handleViewDetails(hospital._id)}
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No hospitals found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalSearch;
