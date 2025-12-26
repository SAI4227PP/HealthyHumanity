import React, { useState, useEffect } from 'react';
import { 
  Activity, Users, FileText, Beaker, TrendingUp, Clock, 
  Calendar, AlertCircle, CheckCircle, BarChart2, DollarSign, 
  ArrowRight
} from 'lucide-react';
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders, getLabData } from '../../utils/authUtils';
import { toast } from 'react-toastify';
import { format, subHours } from 'date-fns';

const LabHome = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Add notification count for demo
  const notifications = 3;

  // Helper function to generate dates
  const generateDateData = () => {
    const now = new Date();
    
    // For week view
    const weekData = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - index));
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        total: Math.floor(Math.random() * (80 - 30) + 30),
        completed: Math.floor(Math.random() * (60 - 20) + 20),
        pending: Math.floor(Math.random() * (15 - 2) + 2),
        cancelled: Math.floor(Math.random() * 5)
      };
    });

    // For month view
    const monthData = Array.from({ length: 4 }).map((_, index) => {
      const date = new Date(now);
      date.setDate(date.getDate() - ((3 - index) * 7));
      return {
        day: `Week ${index + 1}`,
        date: date.toISOString().split('T')[0],
        total: Math.floor(Math.random() * (400 - 250) + 250),
        completed: Math.floor(Math.random() * (350 - 200) + 200),
        pending: Math.floor(Math.random() * (50 - 20) + 20),
        cancelled: Math.floor(Math.random() * 20)
      };
    });

    return { week: weekData, month: monthData };
  };

  const testData = generateDateData();

  // Calculate quick stats based on today's data and actual test prices
  const getTodayStats = () => {
    // Calculate from actual appointments instead of testData
    const todayAppointments = upcomingTests || [];
    const completedTests = todayAppointments.filter(test => test.status === 'completed').length;
    const pendingTests = todayAppointments.filter(test => test.status === 'pending').length;

    // Calculate total revenue from actual appointments
    const totalRevenue = todayAppointments.reduce((sum, test) => {
      if (['pending', 'completed'].includes(test.status)) {
        return sum + (test.price || 400);
      }
      return sum;
    }, 0);

    return [
      {
        icon: <CheckCircle className="w-8 h-8 text-green-500" />,
        label: "Completed Today",
        value: `${completedTests} Tests`,
        bgColor: "bg-green-50",
        textColor: "text-green-600"
      },
      {
        icon: <Clock className="w-8 h-8 text-yellow-500" />,
        label: "Pending",
        value: `${pendingTests} Tests`,
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600"
      },
      {
        icon: <DollarSign className="w-8 h-8 text-purple-500" />,
        label: "Today's Revenue",
        value: `₹${totalRevenue.toLocaleString('en-IN')}`,
        bgColor: "bg-purple-50",
        textColor: "text-purple-600"
      }
    ];
  };

  // Replace the static Quick Stats Bar with dynamic data
  const QuickStatsBar = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {getTodayStats().map((stat, index) => (
        <div key={index} className={`flex items-center p-4 ${stat.bgColor} rounded-lg`}>
          {stat.icon}
          <div className="ml-4">
            <p className={`text-sm ${stat.textColor}`}>{stat.label}</p>
            <p className={`text-xl font-bold ${stat.textColor.replace('600', '700')}`}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // Generate recent activities based on current time
  const generateRecentActivities = () => {
    const now = new Date();
    return [
      {
        text: `Blood Test #${Math.floor(Math.random() * 1000)} results uploaded`,
        time: '5 mins ago',
        type: 'upload'
      },
      {
        text: 'New appointment scheduled',
        time: '1 hour ago',
        type: 'schedule'
      },
      {
        text: `Test report generated for Patient #${Math.floor(Math.random() * 1000)}`,
        time: '2 hours ago',
        type: 'report'
      },
      {
        text: 'Equipment maintenance completed',
        time: format(subHours(now, 3), 'h:mm a'),
        type: 'maintenance'
      }
    ];
  };

  // Fetch appointments (tests) from API
  const fetchUpcomingTests = async () => {
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
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      if (data.success) {
        // Filter for today's appointments and map to required format
        const today = new Date().toDateString();
        const todayTests = data.data
          .filter(test => new Date(test.date).toDateString() === today)
          .map(test => ({
            id: test.id,
            patient: test.patient,
            avatar: test.patient.split(' ').map(n => n[0]).join(''),
            testType: test.type,
            schedule: new Date(test.date).toLocaleString(),
            status: test.status,
            price: test.price || 400, // Include price, default to 400 if not provided
            phone: test.phone || '+1 234-567-8901', // fallback if not in API
            email: test.Email || 'patient@example.com' // fallback if not in API
          }));
        setUpcomingTests(todayTests);
      }
    } catch (error) {
      console.error('Error fetching upcoming tests:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingTests();
    const interval = setInterval(fetchUpcomingTests, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      {/* Header Section with Quick Actions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laboratory Dashboard</h1>
            <p className="text-gray-600">Welcome back, Central Lab</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Notifications ({notifications})</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Beaker className="w-5 h-5" />
              <span>New Test</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <QuickStatsBar />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Test Status Overview */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Test Status Overview</h2>
                <p className="text-sm text-gray-500">Combined performance analysis</p>
              </div>
              <div className="flex gap-3 items-center">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
              </div>
            </div>

            {/* Enhanced Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={testData[timeRange]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      padding: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    fill="#f3f4f6"
                    stroke="#9ca3af"
                    name="Total Tests"
                  />
                  <Bar dataKey="completed" stackId="stack" fill="#8b5cf6" name="Completed" />
                  <Bar dataKey="pending" stackId="stack" fill="#fbbf24" name="Pending" />
                  <Bar dataKey="cancelled" stackId="stack" fill="#ef4444" name="Cancelled" />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#4c1d95"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Completion Trend"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Indicators */}
            <div className="flex justify-center gap-6 mt-4">
              {[
                { label: 'Completed', color: 'bg-purple-500' },
                { label: 'Pending', color: 'bg-yellow-400' },
                { label: 'Cancelled', color: 'bg-red-500' },
                { label: 'Total Tests', color: 'bg-gray-300' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              {[
                { label: 'Average Tests/Day', value: '42', trend: '+8%', color: 'text-green-600' },
                { label: 'Completion Rate', value: '94%', trend: '+2.5%', color: 'text-green-600' },
                { label: 'Cancellation Rate', value: '3%', trend: '-0.5%', color: 'text-red-600' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  <span className={`text-sm ${stat.color}`}>{stat.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {generateRecentActivities().map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tests */}
        <div className="col-span-12">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Upcoming Tests</h2>
                <p className="text-sm text-gray-500">Scheduled for today</p>
              </div>
              <button 
                onClick={() => navigate('/lab/tests')}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading upcoming tests...
                </div>
              ) : upcomingTests.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {upcomingTests.map((test) => (
                      <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-600 font-medium">{test.avatar}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{test.patient}</div>
                              <div className="text-sm text-gray-500">{test.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{test.testType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{test.schedule}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            test.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-3">
                            <button className="text-purple-600 hover:text-purple-900">View</button>
                            <button className="text-gray-600 hover:text-gray-900">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No tests scheduled for today
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabHome;
