import React from 'react';
import { Activity, Plus, Timer, Target, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExerciseLog() {
  const exercises = [
    { type: 'Cardio', name: 'Running', duration: '30 mins', calories: 300 },
    { type: 'Strength', name: 'Weight Training', duration: '45 mins', calories: 200 },
    { type: 'Flexibility', name: 'Yoga', duration: '20 mins', calories: 150 }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-700 flex items-center pt-10 sm:pt-0">
          <Activity className="mr-2" />
          Exercise Log
        </h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center">
          <Plus className="w-5 h-5 mr-1" />
          Log Exercise
        </button>
      </div>

      {/* Today's Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="font-semibold text-lg mb-3">{exercise.name}</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                <span>{exercise.type}</span>
              </div>
              <div className="flex items-center">
                <Timer className="w-4 h-4 mr-2" />
                <span>{exercise.duration}</span>
              </div>
              <div className="flex items-center">
                <BarChart className="w-4 h-4 mr-2" />
                <span>{exercise.calories} calories</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          Chart placeholder
        </div>
      </div>
    </div>
  );
}
