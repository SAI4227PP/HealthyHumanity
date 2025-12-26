import React from 'react';
import { Activity, TrendingUp, Heart, Moon, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthMetrics() {
  const metrics = [
    { title: 'Steps', value: '7,543', target: '10,000', icon: Activity, unit: 'steps' },
    { title: 'Heart Rate', value: '72', icon: Heart, unit: 'bpm' },
    { title: 'Sleep', value: '7.2', icon: Moon, unit: 'hours' },
    { title: 'Water', value: '6', icon: Droplet, unit: 'glasses' }
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-teal-700 mb-6 flex items-center pt-5 sm:pt-0">
        <TrendingUp className="mr-2" />
        Health Metrics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center mb-4">
              <metric.icon className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-lg font-semibold">{metric.title}</h2>
            </div>
            <div className="text-3xl font-bold text-teal-700 mb-2">
              {metric.value}
              <span className="text-sm font-normal text-gray-600 ml-1">
                {metric.unit}
              </span>
            </div>
            {metric.target && (
              <div className="text-sm text-gray-600">
                Target: {metric.target} {metric.unit}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Weekly Progress Chart */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
        {/* Add chart component here */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          Chart placeholder
        </div>
      </div>
    </div>
  );
}
