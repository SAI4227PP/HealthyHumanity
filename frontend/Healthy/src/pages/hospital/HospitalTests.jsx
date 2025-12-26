import React from 'react';
import { Thermometer, Search, Filter } from 'lucide-react';

const HospitalTests = () => {
  const tests = [
    { id: 1, name: 'Blood Test', patients: 45, pending: 12, completed: 33 },
    { id: 2, name: 'X-Ray', patients: 28, pending: 8, completed: 20 },
    { id: 3, name: 'MRI Scan', patients: 15, pending: 5, completed: 10 },
    // Add more test data as needed
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Tests</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button className="p-2 border rounded-lg">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Patients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tests.map((test) => (
              <tr key={test.id}>
                <td className="px-6 py-4">{test.name}</td>
                <td className="px-6 py-4">{test.patients}</td>
                <td className="px-6 py-4 text-yellow-500">{test.pending}</td>
                <td className="px-6 py-4 text-green-500">{test.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HospitalTests;
