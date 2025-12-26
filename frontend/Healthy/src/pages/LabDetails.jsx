import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LabDetails() {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [testsError, setTestsError] = useState(null);

  useEffect(() => {
    const fetchLabDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/${labId}`);
        const data = await response.json();
        
        if (data.success) {
          console.log('Lab data:', data.data); // For debugging
          setLab(data.data);
        } else {
          setError(data.message || 'Failed to fetch lab details');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch lab details');
      } finally {
        setLoading(false);
      }
    };

    if (labId) {
      fetchLabDetails();
    }
  }, [labId]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setTestsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tests/`);
        const data = await response.json();
        
        if (data.success) {
          console.log('Tests data:', data.data); // For debugging
          setTests(data.data);
        } else {
          setTestsError(data.message || 'Failed to fetch tests');
        }
      } catch (err) {
        console.error('Error:', err);
        setTestsError('Failed to fetch tests');
      } finally {
        setTestsLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 text-red-500 bg-red-50 rounded-lg">
      {error}
    </div>
  );
  
  if (!lab) return (
    <div className="p-4 text-gray-500 bg-gray-50 rounded-lg">
      Lab not found
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-teal-700 mb-2">{lab.labName}</h1>
            <div className="flex gap-4 mt-2">
              {lab.specialization && (
                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm">
                  {lab.specialization}
                </span>
              )}
              {lab.isVerified && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Verified Lab
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <p className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-teal-600" />
              {lab.address ? 
                `${lab.address.street}, ${lab.address.city}, ${lab.address.state} ${lab.address.zipCode}` 
                : 'Address not available'
              }
            </p>
            <p className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-2 text-teal-600" />
              {lab.phone || 'Phone not available'}
            </p>
            <p className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-2 text-teal-600" />
              {lab.email || 'Email not available'}
            </p>
          </div>
          <div className="space-y-4">
            <p className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2 text-teal-600" />
              Operating Hours: 9:00 AM - 6:00 PM
            </p>
            <p className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2 text-teal-600" />
              Open Monday - Saturday
            </p>
          </div>
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold text-teal-700 mb-4">Available Tests</h2>
      {testsLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : testsError ? (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{testsError}</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No tests available at this time</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <motion.div
              key={test._id}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-2">{test.name}</h3>
              <p className="text-gray-600 mb-4">{test.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-teal-600">₹{test.price}</span>
                <button 
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                  onClick={() => navigate(`/dashboard/test/${test._id}`)}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
