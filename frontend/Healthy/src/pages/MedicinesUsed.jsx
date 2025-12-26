import React, { useState, useEffect } from 'react';
import { Pill, Clock, AlertCircle, Calendar, Plus, Trash2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const MedicinesUsed = () => {
  const { user, isAuthenticated } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true); // Add this state
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (user && user.id) {
      fetchMedicines();
    }
  }, [user]);

  const fetchMedicines = async () => {
    if (!user || !user.id) {
      toast.error('Please log in to view medicines');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/medicines/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch medicines');
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      toast.error('Failed to fetch medicines');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      toast.error('Please log in to add medicines');
      return;
    }

    try {
      const medicineData = {
        ...newMedicine,
        userId: user.id
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/medicines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(medicineData),
      });

      if (!response.ok) throw new Error('Failed to add medicine');

      const addedMedicine = await response.json();
      setMedicines([...medicines, addedMedicine]);
      setShowAddForm(false);
      setNewMedicine({ name: '', dosage: '', frequency: '', startDate: '', endDate: '' });
      toast.success('Medicine added successfully');
    } catch (error) {
      toast.error('Failed to add medicine');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!user || !user.id) {
      toast.error('Please log in to delete medicines');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/medicines/${id}/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete medicine');

      setMedicines(medicines.filter(med => med._id !== id));
      toast.success('Medicine deleted successfully');
    } catch (error) {
      toast.error('Failed to delete medicine');
      console.error('Error:', error);
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setShowEmptyState(false);
  };

  const handleHideAddForm = () => {
    setShowAddForm(false);
    if (medicines.length === 0) {
      setShowEmptyState(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <p>Please log in to view your medicines</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
          <Loader className="animate-spin w-6 h-6 text-teal-600" />
          <span className="ml-2 text-teal-700 font-medium">Loading...</span>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-xl sm:text-2xl font-bold text-teal-700 flex items-center pl-10 sm:pl-0">
    <Pill className="w-6 h-6 sm:w-6 sm:h-6 mr-2" />
    Medicines History
  </h1>
  <button 
    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center"
    onClick={handleShowAddForm}
  >
    <Plus className="w-5 h-5 mr-2" />
    Add Medicine
  </button>
</div>


      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white p-6 rounded-lg shadow-md"
        >
          <form onSubmit={handleAddMedicine} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Medicine Name"
                required
                className="p-2 border rounded"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Dosage"
                required
                className="p-2 border rounded"
                value={newMedicine.dosage}
                onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
              />
              <input
                type="text"
                placeholder="Frequency"
                required
                className="p-2 border rounded"
                value={newMedicine.frequency}
                onChange={(e) => setNewMedicine({...newMedicine, frequency: e.target.value})}
              />
              <input
                type="date"
                placeholder="Start Date"
                required
                className="p-2 border rounded"
                value={newMedicine.startDate}
                onChange={(e) => setNewMedicine({...newMedicine, startDate: e.target.value})}
              />
              <input
                type="date"
                placeholder="End Date"
                required
                className="p-2 border rounded"
                value={newMedicine.endDate}
                onChange={(e) => setNewMedicine({...newMedicine, endDate: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={handleHideAddForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Save Medicine
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {medicines.length > 0 ? (
          medicines.map((medicine) => (
            <motion.div
              key={medicine._id}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{medicine.name}</h3>
                  <p className="text-gray-600">{medicine.dosage}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                    {medicine.frequency}
                  </span>
                  <button
                    onClick={() => handleDelete(medicine._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <div>
                    <p className="text-sm">Start Date</p>
                    <p className="font-medium">
                      {new Date(medicine.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <div>
                    <p className="text-sm">End Date</p>
                    <p className="font-medium">
                      {new Date(medicine.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {medicine.remainingDays <= 15 && (
                <div className="mt-4 flex items-center text-amber-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {medicine.remainingDays} days remaining
                  </span>
                </div>
              )}
            </motion.div>
          ))
        ) : showEmptyState ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <Pill className="w-12 h-12 text-teal-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Medicines Found
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't added any medicines yet.
            </p>
            <button
              onClick={handleShowAddForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Medicine
            </button>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default MedicinesUsed;
