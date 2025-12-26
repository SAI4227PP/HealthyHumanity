import React from 'react';
import { FileText, Download, Printer, Search, Filter, Clock } from 'lucide-react';

const LabReports = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Test Reports</h1>
          <p className="text-gray-600">Manage and view all test reports</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-500" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Total Reports', count: '1,234', icon: FileText, color: 'blue' },
          { title: 'Generated Today', count: '25', icon: Clock, color: 'green' },
          { title: 'Pending Review', count: '12', icon: Clock, color: 'yellow' },
          { title: 'Archived', count: '845', icon: FileText, color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.count}</h3>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button className="px-4 py-2 text-purple-600 border-b-2 border-purple-600">Recent Reports</button>
            <button className="px-4 py-2 text-gray-500 hover:text-purple-600">Archived</button>
            <button className="px-4 py-2 text-gray-500 hover:text-purple-600">Shared</button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded">
                    <FileText className="text-purple-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Blood Test Report #{1000 + index}</h3>
                    <p className="text-sm text-gray-500">Patient: John Doe</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-500 hover:text-purple-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Printer className="w-4 h-4 text-gray-500 hover:text-purple-600" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-500">Jan 24, 2024</p>
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-sm">Completed</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <nav className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LabReports;
