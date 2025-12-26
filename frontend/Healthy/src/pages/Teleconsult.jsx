import React, { useState } from 'react';
import { Video, Calendar, Clock, Search, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Teleconsult() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    { 
      id: 1, 
      name: 'Dr. Sarah Wilson', 
      speciality: 'Cardiologist', 
      available: '10:00 AM - 4:00 PM', 
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      zoomLink: 'https://zoom.us/j/123456789'
    },
    { 
      id: 2, 
      name: 'Dr. John Smith', 
      speciality: 'Neurologist', 
      available: '9:00 AM - 3:00 PM', 
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      zoomLink: 'https://zoom.us/j/987654321'
    },
    // Add more doctors as needed
  ];

  const handleBooking = (doctor) => {
    setSelectedDoctor(doctor);
    // Open Zoom link in a new tab
    window.open(doctor.zoomLink, '_blank');
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-lg sm:text-2xl font-bold text-teal-700 flex items-center gap-2 pr-10 pl-9 sm:pl-0">
    <Video className="w-5 h-5  " />
    Video Consultation
  </h1>


      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search doctors by name or speciality"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
            Search
          </button>
        </div>
      </div>

      {/* Available Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            className="bg-white rounded-lg shadow-md p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.speciality}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Available: {doctor.available}
              </p>
            </div>
            <button 
              onClick={() => handleBooking(doctor)}
              className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 flex items-center justify-center gap-2"
            >
              <span>Join Consultation</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            {selectedDoctor?.id === doctor.id && (
              <div className="mt-2 text-sm text-teal-600 text-center">
                Opening Zoom meeting...
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Optional: Add a Modal for confirmation */}
      {selectedDoctor && (
        <div className="fixed bottom-4 right-4 bg-teal-100 p-4 rounded-lg shadow-lg">
          <p className="text-teal-800">
            Joining consultation with {selectedDoctor.name}
          </p>
        </div>
      )}
    </div>
  );
}
