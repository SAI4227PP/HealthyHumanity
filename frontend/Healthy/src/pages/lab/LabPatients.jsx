import React, { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Users, Activity, Calendar, Download } from 'lucide-react';
import { getAuthHeaders, getLabData } from '../../utils/authUtils';
import { toast } from 'react-toastify';

const LabPatients = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      const labData = getLabData();
      if (!labData || !labData.id) {
        throw new Error('Lab authentication required');
      }

      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/lab/lab-tests/${labData.id}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      if (data.success) {
        // Group tests by patient
        const transformedPatients = data.data.reduce((acc, test) => {
          const patientKey = test.patient.toLowerCase();
          
          if (!acc[patientKey]) {
            acc[patientKey] = {
              id: test.id.slice(-6),
              name: test.patient,
              age: "N/A",
              tests: 1,
              lastVisit: test.date,
              // Track all statuses
              statuses: new Set([test.status]),
              pendingTests: test.status === 'pending' ? 1 : 0,
              inProgressTests: test.status.toLowerCase() === 'in progress' ? 1 : 0,
              rejectedTests: test.status === 'rejected' ? 1 : 0,
              completedTests: test.status === 'completed' ? 1 : 0,
              allTests: [test],
              testTypes: [test.type]
            };
          } else {
            acc[patientKey].tests += 1;
            // Update last visit if more recent
            if (new Date(test.date) > new Date(acc[patientKey].lastVisit)) {
              acc[patientKey].lastVisit = test.date;
            }
            // Track all statuses
            acc[patientKey].statuses.add(test.status);
            
            if (test.status === 'pending') acc[patientKey].pendingTests++;
            if (test.status.toLowerCase() === 'in progress') acc[patientKey].inProgressTests++;
            if (test.status === 'rejected') acc[patientKey].rejectedTests++;
            if (test.status === 'completed') acc[patientKey].completedTests++;
            
            if (!acc[patientKey].testTypes.includes(test.type)) {
              acc[patientKey].testTypes.push(test.type);
            }
            acc[patientKey].allTests.push(test);
          }
          return acc;
        }, {});

        // Process the statuses into a display format
        const patientsWithStatus = Object.values(transformedPatients).map(patient => ({
          ...patient,
          // Convert Set to Array for display
          statusList: Array.from(patient.statuses),
          // Determine primary status for filtering (prioritize pending)
          status: patient.pendingTests > 0 ? 'pending' : 
                 patient.inProgressTests > 0 ? 'in progress' :
                 patient.rejectedTests > 0 ? 'rejected' : 'completed'
        }));

        setPatients(patientsWithStatus);
      } else {
        throw new Error(data.message || 'Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredPatients = patients.filter(patient => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'inProgress') {
      return patient.status === 'in progress';
    }
    return patient.status === activeFilter;
  });

  const statusCounts = {
    all: patients.length,
    pending: patients.filter(p => p.status === 'pending').length,
    inProgress: patients.filter(p => p.status === 'in progress').length,
    rejected: patients.filter(p => p.status === 'rejected').length,
    completed: patients.filter(p => p.status === 'completed').length
  };

  // Add this function to calculate stats
  const getStats = () => {
    const uniquePatients = new Set(patients.map(p => p.name.toLowerCase())).size;
    const pendingTests = patients.reduce((sum, p) => sum + p.pendingTests, 0);
    const todaysTests = patients.filter(p => 
      new Date(p.lastVisit).toDateString() === new Date().toDateString()
    ).length;

    return [
      { icon: Users, label: 'Total Patients', value: uniquePatients, color: 'blue' },
      { icon: Activity, label: 'Pending Tests', value: pendingTests, color: 'yellow' },
      { icon: Calendar, label: 'Tests Today', value: todaysTests, color: 'purple' },
      { icon: Activity, label: 'Total Tests', value: patients.reduce((sum, p) => sum + p.tests, 0), color: 'green' }
    ];
  };

  const filterTabs = [
    { key: 'all', label: 'All Patients' },
    { key: 'pending', label: 'Pending' },
    { key: 'inProgress', label: 'In Progress' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
          <p className="text-gray-600">Manage and track patient records</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Export
          </button>
          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            <UserPlus className="w-5 h-5" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          // Show skeletons while loading
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))
        ) : (
          getStats().map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {filterTabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-4 py-2 relative ${
                    activeFilter === key
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-purple-600'
                  }`}
                >
                  {label}
                  <span className="ml-2 text-xs text-gray-500">
                    ({statusCounts[key]})
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">#{patient.id.toString().padStart(4, '0')}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.age} years
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{patient.tests} tests total</div>
                    <div className="text-xs text-gray-400">
                      {patient.testTypes.length} unique types
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{new Date(patient.lastVisit).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">
                      {patient.pendingTests} pending
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {patient.statusList.map((status, index) => (
                      <span key={index} className={`px-2 py-1 text-xs rounded-full inline-block ${
                        status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        status === 'completed' ? 'bg-green-100 text-green-800' :
                        status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                        status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {status === 'pending' && ` (${patient.pendingTests})`}
                        {status === 'in progress' && ` (${patient.inProgressTests})`}
                        {status === 'completed' && ` (${patient.completedTests})`}
                        {status === 'rejected' && ` (${patient.rejectedTests})`}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-3">
                    <button className="text-purple-600 hover:text-purple-900">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No patients found for the selected status
          </div>
        )}
      </div>
    </div>
  );
};

export default LabPatients;
