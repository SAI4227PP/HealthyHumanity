import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Star, Clock, Mail, Phone, Calendar, Eye, EyeOff } from 'lucide-react';  // Add Eye and EyeOff icons
import toast from 'react-hot-toast';
import { HospitalContext, useHospital } from '../../context/HospitalContext';

const specialties = [
  'All Specialties',
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedist',
  'Dermatologist'
];

const availability = ['All Status', 'Available', 'In Surgery', 'On Leave'];

const HospitalDoctors = () => {
  const { hospital } = useContext(HospitalContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedAvailability, setSelectedAvailability] = useState('All Status');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    experience: '',
    rating: 0,
    patients: 0,
    availability: 'Available',
    schedule: '',
    email: '',
    phone: '',
    image: '',
    education: '',
    nextAvailable: '',
    qualifications: '',
    languages: '',
    consultationFee: '',
    password: '', // Add password field
    availableSlots: '', // Add availableSlots field
  });
  const [showPassword, setShowPassword] = useState(false);  // Add this state

  // Fetch doctors when component mounts
  useEffect(() => {
    if (hospital?._id) {
      fetchDoctors();
    }
  }, [hospital]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('hospitalToken');
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/doctors/hospital/${hospital._id}`,
        {
          headers: {
            'Authorization': token
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch doctors');

      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update filtering logic to use fetched doctors
  useEffect(() => {
    if (!doctors.length) return;

    const filtered = doctors.filter(doctor => {
      const matchesSearch = searchTerm === '' || 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.education.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty = 
        selectedSpecialty === 'All Specialties' || 
        doctor.specialization === selectedSpecialty;

      const matchesAvailability = 
        selectedAvailability === 'All Status' || 
        doctor.availability === selectedAvailability;

      return matchesSearch && matchesSpecialty && matchesAvailability;
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, selectedAvailability, doctors]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!hospital?._id) {
      toast.error('Hospital ID not found');
      return;
    }

    try {
      const token = localStorage.getItem('hospitalToken');
      if (!token) {
        toast.error('Please login again');
        return;
      }

      // Updated doctorData to match backend requirements
      const doctorData = {
        name: newDoctor.name,
        specialization: newDoctor.specialty, // Changed from specialty to specialization
        experience: newDoctor.experience,
        patients: parseInt(newDoctor.patients) || 0,
        availability: newDoctor.availability,
        schedule: newDoctor.schedule,
        email: newDoctor.email,
        phone: newDoctor.phone,
        image: newDoctor.image,
        education: newDoctor.education,
        nextAvailable: newDoctor.nextAvailable,
        qualifications: [newDoctor.education], // Added as array
        languages: newDoctor.languages.split(',').map(lang => lang.trim()), // Convert to array
        consultationFee: parseFloat(newDoctor.consultationFee) || 0,
        password: newDoctor.password || undefined, // Include password if provided
        availableSlots: newDoctor.availableSlots.split(',').map(slot => slot.trim()), // Add availableSlots
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/hospital/${hospital._id}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(doctorData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add doctor');
      }

      // Show the temporary password if one was generated
      if (data.doctor.temporaryPassword) {
        toast.success(
          <div>
            Doctor added successfully!<br/>
            Temporary password: <strong>{data.doctor.temporaryPassword}</strong><br/>
            Please save this password.
          </div>,
          { duration: 10000 } // Show for 10 seconds
        );
      } else {
        toast.success('Doctor added successfully');
      }

      setShowAddModal(false);
      setNewDoctor({
        name: '',
        specialty: '',
        experience: '',
        rating: 0,
        patients: 0,
        availability: 'Available',
        schedule: '',
        email: '',
        phone: '',
        image: '',
        education: '',
        nextAvailable: '',
        qualifications: '',
        languages: '',
        consultationFee: '',
        password: '',
        availableSlots: '', // Reset availableSlots
      });
      
      fetchDoctors();
    } catch (error) {
      toast.error(error.message || 'Failed to add doctor');
      console.error('Error adding doctor:', error);
    }

    // After successful addition
    fetchDoctors(); // Refresh the doctors list
  };

  // Check for hospital context loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Reset filters function
  const handleReset = () => {
    setSearchTerm('');
    setSelectedSpecialty('All Specialties');
    setSelectedAvailability('All Status');
  };

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/signin/${doctorId}`);
  };

  const seedInitialDoctors = async () => {
    try {
      const token = localStorage.getItem('hospitalToken');
      if (!token || !hospital?._id) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/doctors/hospital/${hospital._id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      toast.success(`Added ${data.count} initial doctors`);
      // Refresh the doctors list
      setFilteredDoctors(data.doctors);
    } catch (error) {
      toast.error(error.message || 'Failed to add initial doctors');
    }
  };

  const formatSlot = (slot) => {
    try {
      if (typeof slot === 'string') {
        // First, try to parse "Monday 10:00 -5:00" format
        const parts = slot.trim().split(' ');
        if (parts.length === 3) {
          const day = parts[0];
          const startTime = parts[1];
          const endTime = parts[2].startsWith('-') ? parts[2].substring(1) : parts[2];
          return `${day} ${startTime}-${endTime}`;
        }
      }
      return slot; // Return original if parsing fails
    } catch (error) {
      console.error('Error formatting slot:', error);
      return slot;
    }
  };

  const renderDoctorCard = (doctor) => (
    <div 
      key={doctor._id} 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleDoctorClick(doctor._id)}
    >
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
            {doctor.avatar ? (
              <img 
                src={doctor.avatar} 
                alt={doctor.name}
                className="h-16 w-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-doctor.jpg';
                }}
              />
            ) : (
              <span className="text-2xl font-medium text-gray-600">
                {doctor.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
            <p className="text-gray-600">{doctor.specialization}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {doctor.rating > 0 ? `${doctor.rating} Rating` : 'New Doctor'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{doctor.experience} Years Experience</span>
          </div>
          {doctor.languages && doctor.languages.length > 0 && doctor.languages[0] !== "" && (
            <div className="text-sm text-gray-600">
              Languages: {doctor.languages.join(', ')}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Consultation Fee</span>
            <span className="font-semibold">₹{doctor.consultationFee}</span>
          </div>
          {doctor.availableSlots && doctor.availableSlots.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {doctor.availableSlots.map((slot, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                  {formatSlot(slot)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Mail className="w-4 h-4" />
            <span>Message</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100">
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Doctors Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor hospital doctors</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={seedInitialDoctors}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Sample Doctors
            </button>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <Plus className="w-5 h-5" />
              Add Doctor
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="absolute right-3 top-2.5 text-sm text-gray-500">
                  {filteredDoctors.length} results
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
              >
                {availability.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-teal-600 flex items-center gap-2"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Active filters display */}
          {(selectedSpecialty !== 'All Specialties' || 
            selectedAvailability !== 'All Status' || 
            searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedSpecialty !== 'All Specialties' && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                  Specialty: {selectedSpecialty}
                </span>
              )}
              {selectedAvailability !== 'All Status' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Status: {selectedAvailability}
                </span>
              )}
              {searchTerm && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Search: {searchTerm}
                </span>
              )}
            </div>
          )}
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No doctors found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(renderDoctorCard)}
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Doctor</h2>
            <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialty</label>
                  <select
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    <option value="">Select Specialty</option>
                    {specialties.filter(s => s !== 'All Specialties').map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                  <input
                    type="text"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="e.g. 8 years"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <input
                    type="text"
                    value={newDoctor.education}
                    onChange={(e) => setNewDoctor({...newDoctor, education: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="e.g. MD - Cardiology, MBBS"
                    required
                  />
                </div>
              </div>

              {/* Contact and Schedule */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Schedule</label>
                  <input
                    type="text"
                    value={newDoctor.schedule}
                    onChange={(e) => setNewDoctor({...newDoctor, schedule: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="e.g. Mon-Fri"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Next Available Slot</label>
                  <input
                    type="text"
                    value={newDoctor.nextAvailable}
                    onChange={(e) => setNewDoctor({...newDoctor, nextAvailable: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="e.g. 10:00 AM Tomorrow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Availability Status</label>
                  <select
                    value={newDoctor.availability}
                    onChange={(e) => setNewDoctor({...newDoctor, availability: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  >
                    {availability.filter(s => s !== 'All Status').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                  <input
                    type="number"
                    value={newDoctor.consultationFee}
                    onChange={(e) => setNewDoctor({...newDoctor, consultationFee: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                  <input
                    type="url"
                    value={newDoctor.image}
                    onChange={(e) => setNewDoctor({...newDoctor, image: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="https://example.com/doctor-image.jpg"
                  />
                </div>
              </div>

              {/* Add Password field */}
              <div className="md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password (Optional - will be generated if not provided)
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newDoctor.password}
                      onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                      placeholder="Leave blank for auto-generated password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    If left blank, a temporary password will be generated automatically.
                  </p>
                </div>
              </div>

              {/* Add Slot Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Available Slots
                </label>
                <div className="mt-1 space-y-2">
                  <input
                    type="text"
                    value={newDoctor.availableSlots}
                    onChange={(e) => setNewDoctor({
                      ...newDoctor,
                      availableSlots: e.target.value.split(',').map(slot => slot.trim())
                    })}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Monday 10:00-17:00, Tuesday 09:00-16:00"
                  />
                  <p className="text-sm text-gray-500">
                    Enter slots in format: "Day HH:MM-HH:MM" or "HH:MM -HH:MM Day" separated by commas
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDoctors;
