import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { formatTime } from '../utils/timeUtils';

export default function MedicationReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    medicine: '',
    time: '',
    frequency: 'Daily'
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/reminders`);
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingReminder 
        ? `${import.meta.env.VITE_BASE_URL}/${editingReminder._id}`
        : `${import.meta.env.VITE_BASE_URL}/reminders`;
      
      const method = editingReminder ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(
          editingReminder 
            ? '✏️ Reminder updated!'
            : '✅ New reminder added!'
        );
        fetchReminders();
        setIsModalOpen(false);
        setFormData({ medicine: '', time: '', frequency: 'Daily' });
        setEditingReminder(null);
      } else {
        throw new Error('Failed to save reminder');
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error('Failed to save reminder');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = () => new Promise((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Delete this reminder?</p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => {
                resolve(true);
                toast.dismiss(t.id);
              }}
            >
              Delete
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                resolve(false);
                toast.dismiss(t.id);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    });

    const shouldDelete = await confirmDelete();
    
    if (shouldDelete) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/reminders/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('🗑️ Reminder deleted!', {
            duration: 2000
          });
          fetchReminders();
        } else {
          throw new Error('Failed to delete reminder');
        }
      } catch (error) {
        console.error('Error deleting reminder:', error);
        toast.error('Failed to delete reminder');
      }
    }
  };

  const openEditModal = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      medicine: reminder.medicine,
      time: reminder.time,
      frequency: reminder.frequency
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#059669',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#DC2626',
            },
          },
        }}
      />
      {/* Header */}
<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
  <h1 className="text-lg sm:text-2xl font-bold text-teal-700 flex items-center">
    <Bell className="mr-2 w-5 h-5" />
    Medication Reminders
  </h1>
  <button 
    onClick={() => setIsModalOpen(true)}
    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center w-full sm:w-auto justify-center"
  >
    <Plus className="w-5 h-5 mr-1" />
    Add Reminder
  </button>
</div>


      {/* Reminders Grid */}
      {loading ? (
  <div className="flex justify-center items-center py-8">
    <Loader className="animate-spin w-6 h-6 text-teal-600" />
    <span className="ml-2 text-teal-700 font-medium">Loading...</span>
  </div>
) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {reminders.map((reminder) => (
              <motion.div
                key={reminder._id}
                className="bg-white p-4 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{reminder.medicine}</h3>
                    <p className="text-gray-600">Time: {formatTime(reminder.time)}</p>
                    <p className="text-gray-600">Frequency: {reminder.frequency}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(reminder)}
                      className="p-2 text-teal-600 hover:bg-teal-50 rounded-full"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(reminder._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingReminder ? 'Edit Reminder' : 'Add Reminder'}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingReminder(null);
                  setFormData({ medicine: '', time: '', frequency: 'Daily' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
                  <input
                    type="text"
                    value={formData.medicine}
                    onChange={(e) => setFormData({...formData, medicine: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                >
                  {editingReminder ? 'Update' : 'Add'} Reminder
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {!loading && reminders.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No medication reminders set</p>
        </div>
      )}
    </div>
  );
}
