import React, { useState } from 'react';
import { 
  BarChart2, TrendingUp, Users, DollarSign, Calendar, 
  ChevronDown, ArrowUp, ArrowDown, Activity, Filter
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LabAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [volumeView, setVolumeView] = useState('day');

  const performanceStats = [
    { title: 'Total Revenue', value: '$12,450', change: '+12.5%', trend: 'up' },
    { title: 'Total Tests', value: '1,234', change: '+8.2%', trend: 'up' },
    { title: 'Average Processing Time', value: '2.4 hrs', change: '-5.1%', trend: 'down' },
    { title: 'Patient Satisfaction', value: '4.8/5', change: '+2.3%', trend: 'up' },
  ];

  // Mock data for different views
  const volumeData = {
    day: [
      { name: '09:00', tests: 15, completed: 12, pending: 3 },
      { name: '10:00', tests: 22, completed: 20, pending: 2 },
      { name: '11:00', tests: 18, completed: 15, pending: 3 },
      { name: '12:00', tests: 25, completed: 22, pending: 3 },
      { name: '13:00', tests: 20, completed: 18, pending: 2 },
      { name: '14:00', tests: 28, completed: 25, pending: 3 },
      { name: '15:00', tests: 15, completed: 13, pending: 2 },
    ],
    week: [
      { name: 'Mon', tests: 45, completed: 40, pending: 5 },
      { name: 'Tue', tests: 52, completed: 48, pending: 4 },
      { name: 'Wed', tests: 38, completed: 35, pending: 3 },
      { name: 'Thu', tests: 65, completed: 60, pending: 5 },
      { name: 'Fri', tests: 48, completed: 45, pending: 3 },
      { name: 'Sat', tests: 35, completed: 32, pending: 3 },
      { name: 'Sun', tests: 25, completed: 22, pending: 3 },
    ],
    month: [
      { name: 'Week 1', tests: 308, completed: 285, pending: 23 },
      { name: 'Week 2', tests: 282, completed: 260, pending: 22 },
      { name: 'Week 3', tests: 345, completed: 320, pending: 25 },
      { name: 'Week 4', tests: 290, completed: 270, pending: 20 },
    ],
  };

  const revenueData = [
    { name: 'Week 1', revenue: 12500, growth: 15 },
    { name: 'Week 2', revenue: 14200, growth: 18 },
    { name: 'Week 3', revenue: 13800, growth: 16 },
    { name: 'Week 4', revenue: 15600, growth: 20 },
  ];

  const viewButtons = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' }
  ];

  return (
    <div className="p-6">
      {/* Header with time range selector */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your laboratory performance</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
              <option value="year">Last 12 months</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-2.5" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {performanceStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm text-gray-500">{stat.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1
                ${stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Test Volume Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Test Volume Trends</h2>
              <p className="text-sm text-gray-500">
                {volumeView === 'day' ? 'Hourly' : volumeView === 'week' ? 'Daily' : 'Weekly'} test volume analysis
              </p>
            </div>
            <div className="flex gap-2">
              {viewButtons.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setVolumeView(key)}
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                    volumeView === key
                      ? 'text-purple-600 bg-purple-50 border-purple-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData[volumeView]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.5rem'
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill="#8b5cf6" name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#c4b5fd" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-300 rounded"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Revenue Analytics</h2>
              <p className="text-sm text-gray-500">Financial performance tracking</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border rounded-lg text-purple-600 bg-purple-50">Revenue</button>
              <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">Growth</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.5rem'
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-4 px-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total Revenue: </span>
              <span className="text-green-600">$56,100</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Growth: </span>
              <span className="text-green-600">+17.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Test Categories</h2>
          <div className="space-y-4">
            {[
              { name: 'Blood Tests', percentage: 45, count: 234 },
              { name: 'Urine Analysis', percentage: 25, count: 130 },
              { name: 'Imaging', percentage: 20, count: 104 },
              { name: 'Others', percentage: 10, count: 52 }
            ].map((category, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{category.name}</span>
                  <span className="text-gray-900 font-medium">{category.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Key Performance Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Average Wait Time', value: '15 mins', trend: '-2 mins' },
              { label: 'Test Accuracy Rate', value: '99.8%', trend: '+0.2%' },
              { label: 'Patient Return Rate', value: '85%', trend: '+5%' },
              { label: 'Staff Efficiency', value: '94%', trend: '+3%' }
            ].map((metric, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">{metric.label}</p>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-gray-800">{metric.value}</span>
                  <span className="text-sm text-green-600">{metric.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabAnalytics;
