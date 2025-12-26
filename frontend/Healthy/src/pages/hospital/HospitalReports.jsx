import React, { useState } from 'react';
import { FileText, Download, Filter, Search, Plus, Calendar, ChevronDown, Clock, Star, Printer, Eye } from 'lucide-react';

const reports = [
  {
    id: 1,
    name: 'Monthly Patient Statistics',
    type: 'Analytics',
    date: '2024-01-15',
    size: '2.4 MB',
    department: 'Administration',
    author: 'Dr. Smith',
    status: 'Published',
    priority: 'High',
    downloads: 45,
    lastAccessed: '2 hours ago',
    description: 'Comprehensive analysis of patient flow and department performance metrics.'
  },
  {
    id: 2,
    name: 'Revenue Report Q4 2023',
    type: 'Financial',
    date: '2024-01-10',
    size: '1.8 MB',
    department: 'Finance',
    author: 'Jane Cooper',
    status: 'Published',
    priority: 'Medium',
    downloads: 32,
    lastAccessed: '1 day ago',
    description: 'Quarterly financial summary including revenue, expenses, and profit analysis.'
  },
  {
    id: 3,
    name: 'Department Performance',
    type: 'Performance',
    date: '2024-01-05',
    size: '3.1 MB',
    department: 'HR',
    author: 'Robert Fox',
    status: 'Draft',
    priority: 'Low',
    downloads: 12,
    lastAccessed: '3 days ago',
    description: 'Evaluation of departmental KPIs and staff performance metrics.'
  },
  // Add more reports as needed
];

const reportTypes = ['All Types', 'Analytics', 'Financial', 'Performance', 'Compliance', 'Operational'];
const departments = ['All Departments', 'Administration', 'Finance', 'HR', 'Emergency', 'Surgery'];
const statusOptions = ['All Status', 'Published', 'Draft', 'Archived'];

const HospitalReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('date');
  const [selectedReport, setSelectedReport] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports Management</h1>
            <p className="text-gray-600 mt-1">Generate and manage hospital reports</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
              <Printer className="h-5 w-5" />
              Print Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Plus className="h-5 w-5" />
              Generate Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {reportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid gap-px bg-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{report.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">{report.department}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Last accessed</div>
                      <div className="text-sm font-medium">{report.lastAccessed}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                        <Eye className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Download">
                        <Download className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {report.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {report.downloads} downloads
                  </div>
                  <div>
                    {report.size}
                  </div>
                  <div>
                    By {report.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalReports;
