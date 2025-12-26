import React, { useState, useEffect } from 'react';
import { Users, Activity, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHospital } from '../../context/HospitalContext';
import { useNavigate } from 'react-router-dom';

const HospitalHome = () => {
  const { hospital } = useHospital();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    doctorAppointments: [],
    summary: {
      totalPatients: 0,
      upcomingAppointments: 0,
      completedAppointments: 0,
      pendingAppointments: 0
    }
  });

  // Add this chart data processing
  const [chartData, setChartData] = useState([
    { name: 'Jan', patients: 0, revenue: 0 },
    { name: 'Feb', patients: 0, revenue: 0 },
    { name: 'Mar', patients: 0, revenue: 0 },
    { name: 'Apr', patients: 0, revenue: 0 },
    { name: 'May', patients: 0, revenue: 0 },
    { name: 'Jun', patients: 0, revenue: 0 },
  ]);

  // Add this function to process appointments into chart data
  const processChartData = (appointments) => {
    const monthlyData = {};
    
    // Initialize monthly data
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].forEach(month => {
      monthlyData[month] = { patients: 0, revenue: 0 };
    });

    // Process appointments
    appointments.forEach(doctor => {
      doctor.patients.forEach(patient => {
        const date = new Date(patient.appointmentDate);
        const month = date.toLocaleString('en-US', { month: 'short' });
        if (monthlyData[month]) {
          monthlyData[month].patients += 1;
          monthlyData[month].revenue += patient.consultationFee || 0;
        }
      });
    });

    // Convert to array format for chart
    const chartData = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      patients: data.patients,
      revenue: data.revenue
    }));

    setChartData(chartData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [hospital]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hospitalToken');
      
      if (!token || !hospital?._id) {
        throw new Error('Authentication required');
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
      if (!response.ok) throw new Error(data.message);
      
      setDashboardData(data);
      processChartData(data.doctorAppointments); // Process chart data
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      icon: Users, 
      label: 'Total Patients', 
      value: dashboardData.summary.totalPatients, 
      change: '+12%' 
    },
    { 
      icon: Activity, 
      label: 'Pending Appointments', 
      value: dashboardData.summary.pendingAppointments, 
      change: '+5%' 
    },
    { 
      icon: Calendar, 
      label: 'Total Appointments', 
      value: dashboardData.totalAppointments, 
      change: '+8%' 
    },
    { 
      icon: Users, 
      label: 'Total Doctors', 
      value: dashboardData.totalDoctors, 
      change: '+15%' 
    }
  ];

  // Get recent appointments
  const recentAppointments = dashboardData.doctorAppointments
    .flatMap(doctor => doctor.patients.map(patient => ({
      id: patient.id,
      type: 'Appointment',
      patient: patient.name,
      doctor: doctor.doctorName,
      time: new Date(patient.appointmentDate).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      status: patient.condition
    })))
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  // Get upcoming appointments
  const upcomingAppointments = dashboardData.doctorAppointments
    .flatMap(doctor => doctor.patients
      .filter(patient => new Date(patient.appointmentDate) > new Date())
      .map(patient => ({
        id: patient.id,
        patient: patient.name,
        doctor: doctor.doctorName,
        time: new Date(patient.appointmentDate).toLocaleString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'Consultation',
        status: patient.condition
      })))
    .sort((a, b) => new Date(a.time) - new Date(b.time))
    .slice(0, 5);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Hospital Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, change, delay }) => (
            <div 
              key={label} 
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              style={{
                animation: `fadeInUp 0.5s ease-out ${delay}ms backwards`
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Icon className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                    <p className={`text-xs font-medium ${
                      change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Patient & Revenue Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#0d9488" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6366f1" />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#0d9488" 
                    name="Patients"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    name="Revenue (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
              <button 
                onClick={() => navigate('/hospital/patients')}
                className="text-teal-600 hover:text-teal-700 flex items-center"
              >
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {recentAppointments.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      activity.status === 'Completed' ? 'bg-green-500' : 
                      activity.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.patient} - Dr. {activity.doctor}
                      </p>
                      <p className="text-sm text-gray-500">{activity.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
              <button 
                onClick={() => navigate('/hospital/appointments')}
                className="text-teal-600 hover:text-teal-700 flex items-center"
              >
                View calendar <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      appointment.status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-800">
                        {appointment.patient} - Dr. {appointment.doctor}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{appointment.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalHome;
