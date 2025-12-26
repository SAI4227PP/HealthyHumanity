import React from 'react';
import { Phone, Ambulance, Hospital, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Emergency() {
  const emergencyContacts = [
    { id: 1, name: 'Ambulance', number: '102', icon: Ambulance },
    { id: 2, name: 'Emergency Helpline', number: '112', icon: Phone },
    { id: 3, name: 'Hospital Emergency', number: '1-800-XXX-XXXX', icon: Hospital },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-red-700">Emergency Services</h1>
        </div>
        <p className="text-red-600 mt-2">For immediate medical attention, please call one of these numbers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {emergencyContacts.map((contact) => (
          <motion.a
            key={contact.id}
            href={`tel:${contact.number}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <contact.icon className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{contact.name}</h2>
            <p className="text-2xl font-bold text-red-500">{contact.number}</p>
          </motion.a>
        ))}
      </div>

      {/* Nearby Hospitals */}
      <h2 className="text-xl font-bold mb-4">Nearby Emergency Rooms</h2>
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Add map or hospital list component */}
        <p className="text-gray-600">Loading nearby hospitals...</p>
      </div>
    </div>
  );
}
