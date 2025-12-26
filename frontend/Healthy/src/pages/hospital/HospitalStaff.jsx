import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Mail, Phone, Calendar, Building, UserPlus, Users, BriefcaseMedical, Clock } from 'lucide-react';

const staffMembers = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    role: 'Senior Doctor',
    department: 'Cardiology',
    status: 'Active',
    email: 'sarah.wilson@hospital.com',
    phone: '+1 234-567-8900',
    joinDate: '2020-03-15',
    schedule: 'Morning Shift',
    patients: 45,
    experience: '8 years',
    specialization: 'Cardiac Surgery',
    image: '/path/to/image.jpg'
  },
  {
    id: 2,
    name: 'James Brown',
    role: 'Nurse',
    department: 'Emergency',
    status: 'Active',
    email: 'james.brown@hospital.com',
    phone: '+1 234-567-8901',
    joinDate: '2021-06-20',
    schedule: 'Night Shift',
    patients: 12,
    experience: '5 years',
    specialization: 'Emergency Care',
    image: '/path/to/image.jpg'
  },
  {
    id: 3,
    name: 'Emily Clark',
    role: 'Lab Technician',
    department: 'Laboratory',
    status: 'On Leave',
    email: 'emily.clark@hospital.com',
    phone: '+1 234-567-8902',
    joinDate: '2019-11-10',
    schedule: 'Day Shift',
    patients: 30,
    experience: '6 years',
    specialization: 'Clinical Laboratory',
    image: '/path/to/image.jpg'
  },
  // Add more staff members...
];

const departments = ['All Departments', 'Cardiology', 'Emergency', 'Laboratory', 'Surgery', 'Pediatrics'];
const roles = ['All Roles', 'Doctor', 'Nurse', 'Lab Technician', 'Surgeon', 'Specialist'];
const shifts = ['All Shifts', 'Morning Shift', 'Day Shift', 'Night Shift'];

const HospitalStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedShift, setSelectedShift] = useState('All Shifts');
  const [selectedStaff, setSelectedStaff] = useState(null);

  const stats = [
    { icon: Users, label: 'Total Staff', value: '234', change: '+12%' },
    { icon: UserPlus, label: 'New Joins', value: '18', change: '+5%' },
    { icon: BriefcaseMedical, label: 'On Duty', value: '156', change: '+8%' },
    { icon: Clock, label: 'On Leave', value: '12', change: '-2%' },
  ];

  // Add filtered staff computation
  const filteredStaffMembers = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'All Departments' || 
                             staff.department === selectedDepartment;
    
    const matchesRole = selectedRole === 'All Roles' || 
                       staff.role.includes(selectedRole.replace('All ', ''));
    
    const matchesShift = selectedShift === 'All Shifts' || 
                        staff.schedule === selectedShift;

    return matchesSearch && matchesDepartment && matchesRole && matchesShift;
  });

  // Add pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredStaffMembers.length / itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedRole, selectedShift]);

  const paginatedStaff = filteredStaffMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add reset filters function
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All Departments');
    setSelectedRole('All Roles');
    setSelectedShift('All Shifts');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage hospital staff and departments</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
              <Download className="h-5 w-5" />
              Export List
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Plus className="h-5 w-5" />
              Add Staff
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map(({ icon: Icon, label, value, change }) => (
            <div key={label} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <Icon className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-gray-500">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className={`text-sm ${
                    change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>{change} from last month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff members..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute right-3 top-2.5 text-sm text-gray-500">
                    {filteredStaffMembers.length} results
                  </div>
                )}
              </div>
              <div className="flex gap-4 flex-wrap sm:flex-nowrap">
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
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <select
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                >
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-teal-600 flex items-center gap-2"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            {(selectedDepartment !== 'All Departments' || 
              selectedRole !== 'All Roles' || 
              selectedShift !== 'All Shifts') && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {selectedDepartment !== 'All Departments' && (
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                    Department: {selectedDepartment}
                  </span>
                )}
                {selectedRole !== 'All Roles' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Role: {selectedRole}
                  </span>
                )}
                {selectedShift !== 'All Shifts' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Shift: {selectedShift}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-600 font-medium">{staff.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.specialization}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{staff.role}</div>
                      <div className="text-sm text-gray-500">{staff.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {staff.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {staff.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{staff.schedule}</div>
                      <div className="text-sm text-gray-500">{staff.patients} patients</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        staff.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="text-teal-600 hover:text-teal-900">View</button>
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
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
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredStaffMembers.length)} to {Math.min(currentPage * itemsPerPage, filteredStaffMembers.length)} of {filteredStaffMembers.length} staff members
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                >
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

export default HospitalStaff;
