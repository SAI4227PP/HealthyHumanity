import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Building2, Bell, Mail, Phone, Globe, 
  Lock, Shield, CreditCard, Users, MessageSquare, Save
} from 'lucide-react';

const LabSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    specialization: '',
    labName: '',
    licenseNumber: '',
    address: ''
  });
  const [labInfo, setLabInfo] = useState({
    labName: '',
    licenseNumber: '',
    registrationDate: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    isVerified: false
  });

  useEffect(() => {
    fetchProfileData();
    fetchLabInfo();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('labToken'); // Changed from 'token' to 'labToken'
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/settings/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      console.log('Response type:', contentType); // Debug log
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch profile data');
      }
      
      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      if (Object.keys(data).length === 0) {
        // Handle empty response with defaults
        setProfileData({
          fullName: '',
          phone: '',
          specialization: '',
          labName: 'New Laboratory',
          licenseNumber: '',
          address: ''
        });
      } else {
        setProfileData(data);
      }
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.message.includes('authentication')) {
        // Redirect to login if token is invalid or missing
        window.location.href = '/lab/signin';
      }
      setError(err.message || 'Failed to fetch profile data');
      // Set default values on error
      setProfileData({
        fullName: '',
        phone: '',
        specialization: '',
        labName: 'New Laboratory',
        licenseNumber: '',
        address: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLabInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('labToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/settings/laboratory-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch laboratory information');
      }

      const data = await response.json();
      setLabInfo(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch laboratory information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('labToken'); // Changed from 'token' to 'labToken'
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/settings/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const data = await response.json();
      setError(null);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLabInfoUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('labToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/settings/laboratory-info`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(labInfo)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update laboratory information');
      }

      const data = await response.json();
      setError(null);
      alert('Laboratory information updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update laboratory information');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'lab', label: 'Lab Information', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team Members', icon: Users }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Settings</h2>
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Dr. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={profileData.specialization}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Clinical Laboratory"
                />
              </div>
            </div>
          </div>
        );

      case 'lab':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Laboratory Information</h2>
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory Name</label>
                <input
                  type="text"
                  value={labInfo.labName}
                  onChange={(e) => setLabInfo({ ...labInfo, labName: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Central Laboratory"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                <input
                  type="text"
                  value={labInfo.licenseNumber}
                  onChange={(e) => setLabInfo({ ...labInfo, licenseNumber: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="LAB-12345"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={labInfo.address.street}
                      onChange={(e) => setLabInfo({
                        ...labInfo,
                        address: { ...labInfo.address, street: e.target.value }
                      })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Street Address"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={labInfo.address.city}
                      onChange={(e) => setLabInfo({
                        ...labInfo,
                        address: { ...labInfo.address, city: e.target.value }
                      })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={labInfo.address.state}
                      onChange={(e) => setLabInfo({
                        ...labInfo,
                        address: { ...labInfo.address, state: e.target.value }
                      })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={labInfo.address.zipCode}
                      onChange={(e) => setLabInfo({
                        ...labInfo,
                        address: { ...labInfo.address, zipCode: e.target.value }
                      })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="ZIP Code"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={labInfo.address.country}
                      onChange={(e) => setLabInfo({
                        ...labInfo,
                        address: { ...labInfo.address, country: e.target.value }
                      })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleLabInfoUpdate}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Laboratory Information'}
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Security Settings</h2>
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-700">We recommend using a strong password and enabling two-factor authentication.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-md font-semibold text-gray-800">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Enable 2FA</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { title: 'New Test Results', desc: 'When new test results are available' },
                { title: 'Appointment Reminders', desc: 'Upcoming test appointment notifications' },
                { title: 'System Updates', desc: 'Important updates and maintenance notifications' },
                { title: 'Marketing Updates', desc: 'News about new features and services' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300" />
                      <span className="ml-2 text-sm text-gray-600">Email</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300" />
                      <span className="ml-2 text-sm text-gray-600">SMS</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Billing Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-md font-semibold text-gray-800 mb-2">Current Plan</h3>
                <p className="text-sm text-gray-600">Professional Plan - $49/month</p>
                <div className="mt-4">
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Upgrade Plan
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <span className="ml-3 text-sm text-gray-600">•••• •••• •••• 4242</span>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-gray-800">Edit</button>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    + Add Payment Method
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Billing History</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { date: '2024-01-01', amount: '$49.00', status: 'Paid' },
                        { date: '2023-12-01', amount: '$49.00', status: 'Paid' },
                        { date: '2023-11-01', amount: '$49.00', status: 'Paid' },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 hover:text-purple-700">
                            <button>Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Team Members</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Users className="w-4 h-4" />
                Add Member
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Dr. John Doe', role: 'Lab Director', email: 'john@example.com', status: 'active' },
                { name: 'Jane Smith', role: 'Lab Technician', email: 'jane@example.com', status: 'active' },
                { name: 'Mike Johnson', role: 'Lab Assistant', email: 'mike@example.com', status: 'inactive' },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your laboratory preferences and configurations</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
          onClick={handleSaveChanges}
          disabled={loading}
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default LabSettings;
