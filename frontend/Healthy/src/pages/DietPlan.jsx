import React from 'react';
import { Utensils, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DietPlan() {
  const meals = [
    { time: '8:00 AM', type: 'Breakfast', items: ['Oatmeal', 'Fruits', 'Green Tea'] },
    { time: '11:00 AM', type: 'Snack', items: ['Nuts', 'Apple'] },
    { time: '1:00 PM', type: 'Lunch', items: ['Grilled Chicken', 'Brown Rice', 'Vegetables'] },
    { time: '4:00 PM', type: 'Snack', items: ['Greek Yogurt', 'Berries'] },
    { time: '7:00 PM', type: 'Dinner', items: ['Fish', 'Quinoa', 'Salad'] }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-700 flex items-center pt-5 sm:pt-0">
          <Utensils className="mr-2" />
          Today's Diet Plan
        </h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center">
          <Plus className="w-5 h-5 mr-1" />
          Add Meal
        </button>
      </div>

      <div className="space-y-4">
        {meals.map((meal, index) => (
          <motion.div
            key={meal.time}
            className="bg-white p-4 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-teal-600 mr-2" />
                <h3 className="font-semibold">{meal.type}</h3>
              </div>
              <span className="text-gray-600 text-sm">{meal.time}</span>
            </div>
            <ul className="space-y-1 ml-7">
              {meal.items.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Nutrition Summary */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daily Nutrition Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Add nutrition metrics */}
        </div>
      </div>
    </div>
  );
}
