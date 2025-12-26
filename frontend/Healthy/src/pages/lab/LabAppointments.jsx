import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Plus, ArrowRight, Filter, ChevronDown, AlertCircle } from 'lucide-react';
import { getAuthHeaders, getLabData } from '../../utils/authUtils';
import { toast } from 'react-toastify';

const LabAppointments = () => {
  const [view, setView] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTestType, setSelectedTestType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add this - define status types
  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' }
  ];

  const views = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' }
  ];

  // Add this - helper function to get appointment by time
  const getAppointmentByTime = (time) => {
    return getCurrentViewAppointments().find(apt => apt.time === time);
  };

  // Add this - mock data for week view until we have real data
  const weekAppointments = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  };

  // Fetch appointments (tests) from API
  const fetchAppointments = async () => {
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
        setAppointments(data.data.map(test => ({
          id: test.id,
          patient: test.patient,
          type: test.type,
          date: new Date(test.date),
          status: test.status,
          time: '09:00' // Since time is not in API, defaulting to 9 AM
        })));
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats from actual data
  const getStats = () => {
    const today = new Date().toDateString();
    return [
      {
        label: "Today's Tests",
        value: appointments.filter(apt => new Date(apt.date).toDateString() === today).length,
        change: '+0',
        status: 'neutral'
      },
      {
        label: 'Pending',
        value: appointments.filter(apt => apt.status === 'pending').length,
        change: `+${appointments.filter(apt => apt.status === 'pending').length}`,
        status: 'increase'
      },
      {
        label: 'Rejected',
        value: appointments.filter(apt => apt.status === 'rejected').length,
        change: `+${appointments.filter(apt => apt.status === 'rejected').length}`,
        status: 'decrease'
      }
    ];
  };

  // Get unique test types from actual data
  const getTestTypes = () => {
    const types = new Set(appointments.map(apt => apt.type));
    return [
      { value: 'all', label: 'All Test Types' },
      ...Array.from(types).map(type => ({
        value: type.toLowerCase(),
        label: type
      }))
    ];
  };

  // Filter appointments based on selected filters
  const getFilteredAppointments = () => {
    return appointments.filter(apt => {
      const matchesType = selectedTestType === 'all' || 
                         apt.type.toLowerCase().includes(selectedTestType);
      const matchesStatus = selectedStatus === 'all' || 
                           apt.status === selectedStatus;
      return matchesType && matchesStatus;
    });
  };

  // Get appointments for current view
  const getCurrentViewAppointments = () => {
    const currentDate = selectedDate.toDateString();
    return appointments.filter(apt => 
      new Date(apt.date).toDateString() === currentDate
    );
  };

  const renderCalendarContent = () => {
    switch(view) {
      case 'day':
        return (
          <div className="space-y-4">
            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
              <div key={time} className="flex gap-4">
                <div className="w-20 text-sm text-gray-500 font-medium">{time}</div>
                <div className="flex-1 min-h-[60px] border-l pl-4">
                  {getAppointmentByTime(time) ? (
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded mr-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">
                            {getAppointmentByTime(time).patient}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getAppointmentByTime(time).type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getAppointmentByTime(time).time} - {getAppointmentByTime(time).endTime}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          getAppointmentByTime(time).status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getAppointmentByTime(time).status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full hover:bg-gray-50 transition-colors cursor-pointer rounded p-3">
                      <p className="text-sm text-gray-400">No appointments</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'week':
        return (
          <div className="grid grid-cols-7 gap-4 min-h-[700px]">
            {Object.entries(weekAppointments).map(([day, appointments]) => (
              <div key={day} className="border rounded-lg bg-white overflow-hidden">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-medium text-gray-800">{day}</h3>
                  <p className="text-xs text-gray-500">
                    {appointments.length} appointments
                  </p>
                </div>
                <div className="p-2">
                  {appointments.length > 0 ? (
                    <div className="space-y-2">
                      {appointments.map((apt, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-lg hover:bg-purple-50 cursor-pointer border border-gray-100 transition-colors"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-900">
                              {apt.time}
                            </span>
                            <span className={`text-xs rounded-full px-2 py-0.5 w-fit ${
                              apt.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {apt.patient}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {apt.type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                      <Calendar className="w-5 h-5 mb-1" />
                      <p className="text-xs">No appointments</p>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t">
                  <button className="w-full py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors">
                    + Add Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'month':
        return (
          <div className="grid grid-cols-7 gap-1 min-h-[600px]">
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} className="border p-3 min-h-[100px] hover:bg-gray-50 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">{i + 1}</span>
                {i === 5 && (
                  <div className="mt-1 p-1 text-xs bg-purple-50 text-purple-600 rounded">
                    3 Tests
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header with Stats */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Test Appointments</h1>
            <p className="text-gray-600">
              {loading ? 'Loading appointments...' : 
               `${appointments.length} total appointments`}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            <Plus className="w-5 h-5" />
            Schedule Test
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {getStats().map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  stat.status === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={selectedTestType}
                onChange={(e) => setSelectedTestType(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {getTestTypes().map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-3" />
            </div>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statusTypes.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-3" />
            </div>
            
            {/* Show active filters */}
            {(selectedTestType !== 'all' || selectedStatus !== 'all') && (
              <div className="flex items-center gap-2">
                {selectedTestType !== 'all' && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm flex items-center gap-2">
                    {testTypes.find(t => t.value === selectedTestType)?.label}
                    <button
                      onClick={() => setSelectedTestType('all')}
                      className="hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedStatus !== 'all' && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm flex items-center gap-2">
                    {statusTypes.find(s => s.value === selectedStatus)?.label}
                    <button
                      onClick={() => setSelectedStatus('all')}
                      className="hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(selectedTestType !== 'all' || selectedStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedTestType('all');
                      setSelectedStatus('all');
                    }}
                    className="text-sm text-gray-500 hover:text-purple-600"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar Section */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm">
          {/* Calendar Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                {views.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === key
                        ? 'text-purple-600 bg-purple-50 font-medium'
                        : 'text-gray-500 hover:text-purple-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedDate(new Date())}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Today
                </button>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                  <span className="font-medium">January 2024</span>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading appointments...
              </div>
            ) : (
              renderCalendarContent()
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left hover:bg-purple-50 rounded-lg text-purple-600">
                New Appointment
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-purple-50 rounded-lg text-purple-600">
                View All Tests
              </button>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-4">Today's Schedule</h2>
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : getFilteredAppointments().length > 0 ? (
              <div className="space-y-4">
                {getFilteredAppointments().map((apt) => (
                  <div key={apt.id} className="p-3 hover:bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{apt.patient}</p>
                    <p className="text-sm text-gray-500">{apt.type}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {new Date(apt.date).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No appointments match the selected filters
              </div>
            )}
          </div>

          {/* Additional Sidebar Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Appointment Conflict</p>
                  <p className="text-xs text-gray-500">Two appointments scheduled for 14:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabAppointments;
