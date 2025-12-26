import React, { useState } from 'react';
import { DollarSign, CreditCard, Download, Search, Filter, Calendar, TrendingUp, Users, FileText, ChevronDown, Printer } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const analyticsData = [
  { month: 'Jan', revenue: 24500, expenses: 18000, profit: 6500 },
  { month: 'Feb', revenue: 28000, expenses: 19500, profit: 8500 },
  { month: 'Mar', revenue: 32000, expenses: 22000, profit: 10000 },
  { month: 'Apr', revenue: 35500, expenses: 23500, profit: 12000 },
  { month: 'May', revenue: 38000, expenses: 25000, profit: 13000 },
  { month: 'Jun', revenue: 42000, expenses: 27000, profit: 15000 },
];

const transactions = [
  { 
    id: 1, 
    invoice: 'INV-2024-003',
    patient: 'John Doe', 
    service: 'General Checkup', 
    department: 'General Medicine',
    amount: 150, 
    date: '2024-01-15', 
    status: 'Paid',
    paymentMethod: 'Cash'
  },
  { 
    id: 2, 
    invoice: 'INV-2024-004',
    patient: 'Jane Smith', 
    service: 'Blood Test', 
    department: 'Laboratory',
    amount: 75, 
    date: '2024-01-14', 
    status: 'Pending',
    paymentMethod: 'Insurance'
  },
  { 
    id: 3, 
    invoice: 'INV-2024-005',
    patient: 'Mike Johnson', 
    service: 'X-Ray', 
    department: 'Radiology',
    amount: 200, 
    date: '2024-01-13', 
    status: 'Paid',
    paymentMethod: 'Credit Card'
  },
  { 
    id: 4, 
    invoice: 'INV-2024-001',
    patient: 'Sarah Wilson', 
    service: 'MRI Scan', 
    department: 'Radiology',
    amount: 850, 
    date: '2024-01-12', 
    status: 'Paid',
    paymentMethod: 'Credit Card'
  },
  { 
    id: 5, 
    invoice: 'INV-2024-002',
    patient: 'Robert Brown', 
    service: 'Surgery', 
    department: 'Surgery',
    amount: 3500, 
    date: '2024-01-11', 
    status: 'Pending',
    paymentMethod: 'Insurance'
  }
];

const getAnalyticsDataByRange = (range) => {
  switch (range) {
    case 'week':
      return [
        { month: 'Mon', revenue: 8500, expenses: 6000, profit: 2500 },
        { month: 'Tue', revenue: 9200, expenses: 6500, profit: 2700 },
        { month: 'Wed', revenue: 8900, expenses: 6200, profit: 2700 },
        { month: 'Thu', revenue: 9500, expenses: 6800, profit: 2700 },
        { month: 'Fri', revenue: 9800, expenses: 7000, profit: 2800 },
        { month: 'Sat', revenue: 8700, expenses: 6100, profit: 2600 },
        { month: 'Sun', revenue: 7900, expenses: 5500, profit: 2400 },
      ];
    case 'month':
      return [
        { month: 'Week 1', revenue: 35000, expenses: 25000, profit: 10000 },
        { month: 'Week 2', revenue: 38000, expenses: 27000, profit: 11000 },
        { month: 'Week 3', revenue: 36500, expenses: 26000, profit: 10500 },
        { month: 'Week 4', revenue: 39000, expenses: 28000, profit: 11000 },
      ];
    case 'year':
      return [
        { month: 'Jan', revenue: 24500, expenses: 18000, profit: 6500 },
        { month: 'Feb', revenue: 28000, expenses: 19500, profit: 8500 },
        { month: 'Mar', revenue: 32000, expenses: 22000, profit: 10000 },
        { month: 'Apr', revenue: 35500, expenses: 23500, profit: 12000 },
        { month: 'May', revenue: 38000, expenses: 25000, profit: 13000 },
        { month: 'Jun', revenue: 42000, expenses: 27000, profit: 15000 },
      ];
    default:
      return [];
  }
};

const HospitalBilling = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [analyticsView, setAnalyticsView] = useState('revenue'); // Add this state
  const [activeData, setActiveData] = useState(getAnalyticsDataByRange('week'));

  // Update data when date range changes
  React.useEffect(() => {
    setActiveData(getAnalyticsDataByRange(dateRange));
  }, [dateRange]);

  // Add this function to handle data display based on view
  const getChartData = (view) => {
    switch (view) {
      case 'profit':
        return [
          { dataKey: 'profit', stroke: '#0d9488', name: 'Profit' },
          { dataKey: 'expenses', stroke: '#ef4444', name: 'Expenses' }
        ];
      case 'revenue':
        return [
          { dataKey: 'revenue', stroke: '#0d9488', name: 'Revenue' },
          { dataKey: 'profit', stroke: '#6366f1', name: 'Profit' }
        ];
      case 'expenses':
        return [
          { dataKey: 'expenses', stroke: '#ef4444', name: 'Expenses' },
          { dataKey: 'revenue', stroke: '#0d9488', name: 'Revenue' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Billing Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage hospital finances</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
              <Printer className="h-5 w-5" />
              Print Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Download className="h-5 w-5" />
              Export Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">$42,500</p>
                <p className="text-sm text-green-500">+12% from last month</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold">$3,250</p>
                <p className="text-sm text-yellow-500">5 transactions</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Monthly Profit</p>
                <p className="text-2xl font-bold">$15,000</p>
                <p className="text-sm text-blue-500">+8% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500">Total Invoices</p>
                <p className="text-2xl font-bold">128</p>
                <p className="text-sm text-purple-500">24 this week</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Revenue Analytics</h2>
              <div className="flex items-center gap-4">
                <div className="flex rounded-lg border p-1">
                  {['revenue', 'profit', 'expenses'].map((view) => (
                    <button
                      key={view}
                      className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${
                        analyticsView === view
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setAnalyticsView(view)}
                    >
                      {view}
                    </button>
                  ))}
                </div>
                <select 
                  className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem'
                    }}
                  />
                  {getChartData(analyticsView).map(({ dataKey, stroke, name }) => (
                    <Line
                      key={dataKey}
                      type="monotone"
                      dataKey={dataKey}
                      stroke={stroke}
                      name={name}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Department Revenue</h2>
              <div className="flex items-center gap-4">
                <select 
                  className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#0d9488" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select 
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Calendar className="h-5 w-5" />
                  Date Range
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.invoice}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transaction.patient}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transaction.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transaction.department}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${transaction.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="text-teal-600 hover:text-teal-900">View</button>
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing 5 of 25 results
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalBilling;
