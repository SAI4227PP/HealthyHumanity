import React from 'react';
import { Syringe, Calendar, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VaccinationSchedule() {
  const vaccines = [
    { name: 'COVID-19 Booster', date: '2024-03-15', status: 'Upcoming' },
    { name: 'Flu Shot', date: '2024-02-01', status: 'Completed' },
    { name: 'Tetanus', date: '2023-12-15', status: 'Completed' }
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-teal-700 mb-6 flex items-center pl-8 sm:pl-0">
        <Syringe className="mr-2" />
        Vaccination Schedule
      </h1>

      <div className="space-y-4">
        {vaccines.map((vaccine, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{vaccine.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{vaccine.date}</span>
                </div>
              </div>
              <div className="flex items-center">
                {vaccine.status === 'Completed' ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    Completed
                  </span>
                ) : (
                  <span className="text-blue-600 flex items-center">
                    <Clock className="w-5 h-5 mr-1" />
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vaccination History */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Vaccination History</h2>
        {/* Add vaccination history table/list */}
      </div>
    </div>
  );
}
