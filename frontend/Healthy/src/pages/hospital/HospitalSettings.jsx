import React, { useState, useEffect } from 'react';
import { Building2, Clock, Bell, Shield, Users, Mail, Phone, Globe, CreditCard, Lock, Settings, Save, AlertTriangle } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import toast from 'react-hot-toast';

const settingsSections = [
  { id: 'general', icon: Building2, label: 'General' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
  { id: 'integrations', icon: Settings, label: 'Integrations' }
];

const HospitalSettings = () => {
  const { updateProfile, loading: updating } = useHospital();
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    hospitalName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    openTime: '08:00',
    closeTime: '20:00',
    timezone: 'UTC',
    notifications: {
      email: true,
      sms: false,
      appointmentReminders: true,
      emergencyAlerts: true
    },
    security: {
      twoFactorAuth: false,
      dataSharing: false,
      automaticBackup: true
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('hospitalToken');
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/hospital/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();
        setFormData({
          hospitalName: data.hospitalName || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          openTime: data.openTime || '08:00',
          closeTime: data.closeTime || '20:00',
          timezone: data.timezone || 'UTC',
          notifications: {
            email: data.notifications?.email ?? true,
            sms: data.notifications?.sms ?? false,
            appointmentReminders: data.notifications?.appointmentReminders ?? true,
            emergencyAlerts: data.notifications?.emergencyAlerts ?? true
          },
          security: {
            twoFactorAuth: data.security?.twoFactorAuth ?? false,
            dataSharing: data.security?.dataSharing ?? false,
            automaticBackup: data.security?.automaticBackup ?? true
          }
        });
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        toast.success('Settings updated successfully');
        setHasChanges(false);
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeave = (e) => {
    if (hasChanges) {
      const message = 'You have unsaved changes. Are you sure you want to leave?';
      e.returnValue = message;
      return message;
    }
  };

  React.useEffect(() => {
    window.addEventListener('beforeunload', handleLeave);
    return () => window.removeEventListener('beforeunload', handleLeave);
  }, [hasChanges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error loading settings: {error}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 text-teal-500 hover:text-teal-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hospital Settings</h1>
            <p className="text-gray-600 mt-1">Manage your hospital preferences and configuration</p>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              hasChanges 
                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-1">
                {settingsSections.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${
                      activeSection === id
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {activeSection === 'general' && (
              <div className="bg-white rounded-xl shadow-sm divide-y">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Hospital Information</h2>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                        <input
                          type="text"
                          name="hospitalName"
                          value={formData.hospitalName}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Operating Hours</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                      <input
                        type="time"
                        name="openTime"
                        value={formData.openTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                      <input
                        type="time"
                        name="closeTime"
                        value={formData.closeTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {[
                    { name: 'notifications.email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { name: 'notifications.sms', label: 'SMS Notifications', desc: 'Get alerts via text message' },
                    { name: 'notifications.appointmentReminders', label: 'Appointment Reminders', desc: 'Send reminders to patients' },
                    { name: 'notifications.emergencyAlerts', label: 'Emergency Alerts', desc: 'Urgent notifications' }
                  ].map(({ name, label, desc }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{label}</h3>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={name}
                          checked={name.split('.').reduce((obj, key) => obj[key], formData)}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={formData.twoFactorAuth}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Automatic Backup</h3>
                      <p className="text-sm text-gray-500">Secure your data with automatic backups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="automaticBackup"
                        checked={formData.automaticBackup}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Data Sharing</h3>
                      <p className="text-sm text-gray-500">Share anonymous data for research</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="dataSharing"
                        checked={formData.dataSharing}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {hasChanges && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-yellow-100 p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">You have unsaved changes</span>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg"
                >
                  Save Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalSettings;