import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ScheduleTest() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/all`);
        const data = await response.json();
        if (data.success) {
          setLabs(data.data);
        } else {
          setError('Failed to fetch labs');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-teal-700 mb-6 flex items-center pl-9 sm:pl-0">
        <Calendar className="mr-2" />
        Schedule Lab Test
      </h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
            <input
              type="text"
              placeholder="Search for tests"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter your location"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <button className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700">
          Search Available Slots
        </button>
      </div>

      {/* Available Time Slots */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'].map((time, index) => (
            <motion.button
              key={time}
              className="p-3 border rounded-md hover:bg-teal-50 focus:ring-2 focus:ring-teal-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {time}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lab Centers */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Available Lab Centers</h2>
        <div className="space-y-4">
          {loading ? (
            <p>Loading labs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : labs.length === 0 ? (
            <p>No labs available</p>
          ) : (
            labs.map((lab) => (
              <motion.div
                key={lab._id}
                className="border rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-semibold">{lab.labName || 'Unnamed Lab'}</h3>
                <p className="text-gray-600 flex items-center mt-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {lab.address ? 
                    `${lab.address.street}, ${lab.address.city}` : 
                    'Address not available'
                  }
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {lab.specialization || 'General Laboratory'}
                  </span>
                  {lab.isVerified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <button 
                  className="mt-2 text-teal-600 hover:text-teal-700"
                  onClick={() => navigate(`/dashboard/lab/${lab._id}`)}  // Updated path
                >
                  View Details
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
