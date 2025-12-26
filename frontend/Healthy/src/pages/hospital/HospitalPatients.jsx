import React, { useState, useEffect } from 'react';
import { User, Search, Filter, Plus, MoreVertical, Download, Printer, RefreshCw } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { useNavigate } from 'react-router-dom';

const HospitalPatients = () => {
  const { hospital } = useHospital();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'byDoctor'

  useEffect(() => {
    if (!hospital) {
      navigate('/hospital/login');
    }
  }, [hospital, navigate]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('hospitalToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/hospital/patients/${hospital._id}`,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      console.log('Received data:', data);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('hospitalToken');
          navigate('/hospital/login');
          return;
        }
        throw new Error(data.message || 'Failed to fetch patients');
      }

      setDoctorAppointments(data.doctorAppointments || []);
      // Transform the data for the list view
      const allPatients = data.doctorAppointments.flatMap(doctor => 
        doctor.patients.map(patient => ({
          ...patient,
          doctorName: doctor.doctorName,
          specialization: doctor.specialization
        }))
      );
      setPatients(allPatients);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPatients();
  };

  // Add filtered patients computation
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || patient.condition.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {!hospital ? (
        <div className="text-center p-8">
          <p>Please login to view patients</p>
          <button 
            onClick={() => navigate('/hospital/login')}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patients Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor patient records</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'byDoctor' : 'list')}
                className="bg-white text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 border"
              >
                <Filter className="w-4 h-4" />
                {viewMode === 'list' ? 'Group by Doctor' : 'List View'}
              </button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 border">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 border">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700">
                <Plus className="w-4 h-4" />
                Add Patient
              </button>
            </div>
          </div>

          {viewMode === 'byDoctor' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctorAppointments.map((doctorData) => (
                <div key={doctorData.doctorId} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <User className="w-10 h-10 text-teal-600 bg-teal-100 rounded-full p-2" />
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{doctorData.doctorName}</h3>
                      <p className="text-sm text-gray-500">{doctorData.specialization}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">
                      Total Appointments: {doctorData.appointmentCount}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {doctorData.patients.map((patient) => (
                      <div key={patient.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{patient.name}</p>
                            <p className="text-sm text-gray-500">{patient.contact}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.condition === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : patient.condition === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : patient.condition === 'Confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {patient.condition}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Appointment: {new Date(patient.appointmentDate).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}</p>
                          <p>Fee: ₹{patient.consultationFee}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        {filteredPatients.length} results
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <select 
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      disabled={isRefreshing}
                    >
                      <option value="all">All Conditions</option>
                      <option value="stable">Stable</option>
                      <option value="critical">Critical</option>
                    </select>
                    <button 
                      className={`flex items-center gap-2 text-gray-600 hover:text-teal-600 ${
                        isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Loading patients...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">
                  <p>{error}</p>
                  <button 
                    onClick={fetchPatients}
                    className="mt-2 text-teal-600 hover:text-teal-700"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className={`overflow-x-auto ${isRefreshing ? 'opacity-50' : ''}`}>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredPatients
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-500" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{patient.name}</div>
                                <div className="text-gray-500 text-sm">{patient.contact}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              patient.condition === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : patient.condition === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : patient.condition === 'Confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {patient.condition}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Room {patient.room}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {patient.doctorName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(patient.appointmentDate).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button className="text-teal-600 hover:text-teal-900">View</button>
                              <button className="text-blue-600 hover:text-blue-900">Edit</button>
                              <button className="text-red-600 hover:text-red-900">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPatients.length)} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} results
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button 
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage * itemsPerPage >= filteredPatients.length}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalPatients;
