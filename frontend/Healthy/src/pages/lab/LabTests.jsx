import React, { useState, useEffect } from 'react';
import { Beaker, Search, Filter, Calendar, Clock, Tag, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getAuthHeaders, isLabAuthenticated, getLabId, getLabData } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom'; // Add this line

const LabTests = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Add this line
  const [activeStatus, setActiveStatus] = useState('all');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState([]); // Changed from static to state

  const fetchPendingBookings = async () => {
    try {
      if (!isLabAuthenticated()) {
        throw new Error('Lab authentication required');
      }

      setLoading(true);
      setError(null);

      // Get lab data and verify
      const labData = getLabData();
      if (!labData || !labData.id) {
        throw new Error('Invalid lab credentials');
      }

      console.log('Fetching bookings for lab:', labData.id, labData.labName);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/pending-bookings/${labData.id}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Bookings response:', data);

      if (data.success) {
        setPendingBookings(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      if (err.message.includes('credentials')) {
        // Handle auth errors
        localStorage.removeItem('labToken');
        localStorage.removeItem('lab'); // Changed from 'user' to 'lab'
      }
    } finally {
      setLoading(false);
    }
  };

  // Add this new function
  const fetchLabTests = async () => {
    try {
      const labData = getLabData();
      if (!labData || !labData.id) {
        throw new Error('Lab authentication required');
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/lab/lab-tests/${labData.id}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch test data');
      }

      const data = await response.json();
      if (data.success) {
        setTestData(data.data);
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
      toast.error(error.message);
    }
  };

  const handleBookingResponse = async (booking, action) => {
    try {
      const labData = getLabData();
      if (!labData || !labData.id) {
        throw new Error('Lab authentication required');
      }

      setLoading(true);
      
      let doctorName, labName, rejectionReason;
      if (action === 'accepted') {
        doctorName = prompt('Enter doctor name:');
        labName = labData.labName || prompt('Enter lab name:');
        
        if (!doctorName || !labName) {
          toast.error('Doctor name and lab name are required');
          setLoading(false);
          return;
        }
      } else if (action === 'rejected') {
        rejectionReason = prompt('Enter reason for rejection (optional):');
      }

      const responseData = {
        labId: labData.id,
        action,
        doctorName,
        labName,
        rejectionReason
      };

      console.log('Sending booking response:', {
        bookingId: booking._id,
        ...responseData
      });

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/lab/booking-response/${booking._id}`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(responseData)
        }
      );

      const data = await response.json();
      
      if (data.success) {
        // Remove from pending list regardless of action
        setPendingBookings(prev => prev.filter(b => b._id !== booking._id));
        
        if (action === 'accepted') {
          fetchLabTests();
          toast.success(
            <div>
              <p>Test accepted and assigned</p>
              <p className="text-sm">Doctor: {doctorName}</p>
            </div>
          );
        } else {
          toast.info(
            <div>
              <p>Test rejected</p>
              {rejectionReason && (
                <p className="text-sm text-gray-600">Reason: {rejectionReason}</p>
              )}
              <p className="text-xs text-gray-500">This test will remain visible to other labs</p>
            </div>
          );
        }
      } else {
        throw new Error(data.message || 'Failed to update booking');
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Response error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Replace static testCategories with this function
  const TEST_CATEGORIES = {
    'Blood Tests': ['blood', 'hemoglobin', 'platelet', 'cbc', 'wbc', 'rbc'],
    'Urine Tests': ['urine', 'kidney', 'creatinine'],
    'Imaging': ['x-ray', 'scan', 'mri', 'imaging', 'ultrasound', 'ct'],
    'Pathology': ['biopsy', 'culture', 'tissue'],
    'Infectious Disease': ['tuberculosis', 'infection', 'virus', 'bacterial'],
    'Endocrine': ['thyroid', 'hormone', 'diabetes', 'insulin'],
    'Cardiac': ['cardiac', 'heart', 'ecg', 'ekg', 'cholesterol'],
    'Liver': ['liver', 'hepatic', 'bilirubin'],
    'Cancer': ['cancer', 'tumor', 'oncology'],
    'Bone': ['bone', 'joint', 'arthritis'],
    'Allergy': ['allergy', 'immunology', 'sensitivity'],
  };

  const getTestCategories = () => {
    return testData.reduce((acc, test) => {
      const type = test.type.toLowerCase();
      
      // Find matching category
      let foundCategory = 'Other Tests';
      for (const [category, keywords] of Object.entries(TEST_CATEGORIES)) {
        if (keywords.some(keyword => type.includes(keyword))) {
          foundCategory = category;
          break;
        }
      }

      // Update category counts
      if (!acc[foundCategory]) {
        acc[foundCategory] = {
          name: foundCategory,
          count: 1,
          pending: test.status === 'pending' ? 1 : 0,
          completed: test.status === 'completed' ? 1 : 0,
          tests: [test.type] // Store unique test types in this category
        };
      } else {
        acc[foundCategory].count++;
        if (test.status === 'pending') acc[foundCategory].pending++;
        if (test.status === 'completed') acc[foundCategory].completed++;
        if (!acc[foundCategory].tests.includes(test.type)) {
          acc[foundCategory].tests.push(test.type);
        }
      }
      return acc;
    }, {});
  };

  // Add this function to get category details
  const getCategoryStats = () => {
    const categories = getTestCategories();
    return {
      categories: Object.values(categories),
      totalTests: Object.values(categories).reduce((sum, cat) => sum + cat.count, 0),
      uniqueTestTypes: Object.values(categories).reduce((sum, cat) => sum + cat.tests.length, 0)
    };
  };

  // Update the status filtering logic
  const filteredTests = testData.filter(test => {
    if (activeStatus === 'all') return true;
    if (activeStatus === 'started') { // Changed from 'inProgress'
      return test.status.toLowerCase() === 'started';
    }
    return test.status.toLowerCase() === activeStatus;
  });

  const statusCounts = {
    all: testData.length,
    pending: testData.filter(t => t.status.toLowerCase() === 'pending').length,
    started: testData.filter(t => t.status.toLowerCase() === 'started').length, // Changed from 'inProgress'
    completed: testData.filter(t => t.status.toLowerCase() === 'completed').length,
    rejected: testData.filter(t => t.status.toLowerCase() === 'rejected').length,
  };

  // Update the status tabs section
  const statusTabs = [
    { key: 'all', label: 'All Tests' },
    { key: 'pending', label: 'Pending' },
    { key: 'started', label: 'Started' }, // Changed from 'inProgress'
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' }
  ];

  const renderBookingRow = (booking) => (
    <tr key={booking._id} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {booking.userId?.username || booking.userId?.email || 'Unknown Patient'}
            </div>
            <div className="text-xs text-gray-500">
              {booking.userId?.email}
            </div>
            {booking.userId?.phone && (
              <div className="text-xs text-gray-400">
                {booking.userId.phone}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">{booking.testId?.name}</div>
          <div className="text-xs text-gray-500">₹{booking.testId?.price}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-3">
          <button
            onClick={() => handleBookingResponse(booking, 'accepted')}
            disabled={loading}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            onClick={() => handleBookingResponse(booking, 'rejected')}
            disabled={loading}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </td>
    </tr>
  );

  // Add skeleton loading components
  const CategorySkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const TableRowSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          <div className="ml-3 space-y-1">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-3">
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  // Update useEffect to check authentication
  useEffect(() => {
    const labData = getLabData();
    if (!labData || !labData.id) {
      setError('Valid lab credentials required');
      return;
    }

    fetchPendingBookings();
    fetchLabTests(); // Add this line
    
    const bookingsInterval = setInterval(fetchPendingBookings, 30000);
    const testsInterval = setInterval(fetchLabTests, 30000); // Add this line
    
    return () => {
      clearInterval(bookingsInterval);
      clearInterval(testsInterval); // Add this line
    };
  }, []);  // Removed user.id dependency

  // Add debug effect
  useEffect(() => {
    const checkLab = async () => {
      try {
        const labId = getLabId();
        if (!labId) return;

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/check-lab/${labId}`);
        const data = await response.json();
        console.log('Lab check:', data);
      } catch (error) {
        console.error('Lab check error:', error);
      }
    };

    checkLab();
  }, []); // Removed user.id dependency

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laboratory Tests</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span>Schedule</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Beaker className="w-5 h-5" />
            <span>New Test</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array(4).fill(0).map((_, index) => (
            <CategorySkeleton key={index} />
          ))
        ) : (
          getCategoryStats().categories.map((category) => (
            <div key={category.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-purple-600 font-medium">
                    {category.count} tests ({category.tests.length} types)
                  </p>
                </div>
                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-sm">Active</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Pending: {category.pending}</span>
                  <span>Started: {category.started}</span> {/* Changed from 'inProgress' */}
                  <span>Completed: {category.completed}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pending Bookings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Pending Test Bookings ({pendingBookings.length})
            </h2>
            <p className="text-sm text-gray-500">
              Tests you reject will remain available for other labs
            </p>
          </div>
          <button 
            onClick={fetchPendingBookings}
            className="text-teal-600 hover:text-teal-700"
          >
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="p-4 text-center">Loading pending bookings...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : pendingBookings.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No pending bookings</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingBookings.map(renderBookingRow)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {statusTabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveStatus(key)}
                  className={`px-4 py-2 relative ${
                    activeStatus === key
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="pl-10 w-full p-2 border rounded-lg"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : filteredTests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No tests found for the selected status
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        #{test.id.slice(-6)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {test.patient.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{test.patient}</p>
                          <p className="text-sm text-gray-500">ID: #{test.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(test.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        test.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        test.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                        test.status.toLowerCase() === 'started' ? 'bg-blue-100 text-blue-800' : // Changed from 'in progress'
                        'bg-red-100 text-red-800'
                      }`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => navigate(`/lab/tests/${test.id}`)} 
                          className="text-purple-600 hover:text-purple-900"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => navigate(`/lab/tests/${test.id}`)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-700">Showing 1 to 10 of 50 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTests;
