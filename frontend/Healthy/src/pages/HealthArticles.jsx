import React from 'react';
import { BookOpen, Clock, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthArticles() {
  const articles = [
    {
      title: 'Understanding Blood Pressure',
      author: 'Dr. Sarah Wilson',
      readTime: '5 min read',
      image: 'https://example.com/blood-pressure.jpg'
    },
    // Add more articles...
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl sm:text-xl font-bold text-teal-700 mb-6 flex items-center pl-8 sm:pl-0">
        <BookOpen className="mr-2" />
        Health Tips & Articles
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=Health+Article';
              }}
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">{article.title}</h2>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <User className="w-4 h-4 mr-1" />
                <span className="mr-4">{article.author}</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{article.readTime}</span>
              </div>
              <button className="text-teal-600 flex items-center hover:text-teal-700">
                Read More
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
