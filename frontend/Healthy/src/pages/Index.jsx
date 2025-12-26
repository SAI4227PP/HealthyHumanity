import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Heart, User, Shield, 
  Users, Clock, CheckCircle, 
  Hospital, Award, Stethoscope,
  Calendar, Book, Bell, FileText, 
  Pill, Brain, Smartphone, Video,ArrowRight
} from 'lucide-react';
import { useCountAnimation } from '../hooks/useCountAnimation';

export default function Index() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  const features = [
    { icon: Activity, title: 'Health Monitoring', description: 'Track your vital signs and health metrics in real-time' },
    { icon: Heart, title: 'Medical Records', description: 'Securely store and access your medical history' },
    { icon: User, title: 'Doctor Consultations', description: 'Connect with healthcare professionals online' },
    { icon: Shield, title: 'Data Security', description: 'Your health data is encrypted and secure' },
    { icon: Calendar, title: 'Smart Scheduling', description: 'AI-powered appointment scheduling system' },
    { icon: Video, title: 'Telemedicine', description: 'Virtual consultations with healthcare providers' },
    { icon: Brain, title: 'AI Diagnostics', description: 'Preliminary AI-based symptom analysis' },
    { icon: Smartphone, title: 'Mobile Health', description: 'Track health metrics via smartphone sensors' },
    { icon: Bell, title: 'Health Reminders', description: 'Medication and appointment reminders' },
    { icon: Pill, title: 'Prescription Management', description: 'Digital prescription tracking and renewal' },
    { icon: FileText, title: 'Lab Results', description: 'Digital lab results and analysis' },
    { icon: Book, title: 'Health Education', description: 'Personalized health content and resources' }
  ];

  const stats = [
    { number: 150000, label: "Active Users", icon: Users },
    { number: 5000, label: "Healthcare Providers", icon: Hospital },
    { number: 98, label: "Satisfaction Rate", icon: CheckCircle },
    { number: 500000, label: "Consultations Completed", icon: Stethoscope }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      text: "This platform has revolutionized how I connect with patients. The integration of AI diagnostics with telemedicine is groundbreaking."
    },
    {
      name: "Michael Chen",
      role: "Patient",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "The mobile health tracking and medication reminders have helped me stay on top of my health journey."
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatrician",
      image: "https://randomuser.me/api/portraits/men/10.jpg",
      text: "The platform's user-friendly interface makes it easy for both healthcare providers and patients to manage appointments and records."
    }
  ];

  const latestNews = [
    {
      title: "AI in Healthcare: The Future is Here",
      date: "2024-02-15",
      category: "Technology",
      preview: "Exploring how artificial intelligence is transforming healthcare delivery and improving patient outcomes.",
      image: "/images/ai-health.jpg"
    },
    {
      title: "Mental Health Support Goes Digital",
      date: "2024-02-10",
      category: "Mental Health",
      preview: "New features launched to support mental health awareness and provide virtual counseling services.",
      image: "/images/mental-health.jpg"
    },
    {
      title: "Preventive Care Through Technology",
      date: "2024-02-05",
      category: "Wellness",
      preview: "How regular health monitoring and early detection are revolutionizing preventive care.",
      image: "/images/preventive-care.jpg"
    }
  ];

  const achievements = [
    { 
      icon: Award, 
      title: "Best Healthcare Platform 2024",
      description: "Recognized for innovation in digital healthcare"
    },
    { 
      icon: Stethoscope, 
      title: "500,000+ Consultations",
      description: "Successfully connecting patients with healthcare providers"
    },
    { 
      icon: Heart, 
      title: "150,000+ Active Users",
      description: "Trusted by patients and healthcare professionals"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white overflow-hidden">
      
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-700">HealthyHumanity</h1>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/signin')}
              className="text-teal-600 hover:text-teal-700"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <div className="relative container mx-auto px-6 py-16">
        <motion.div 
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-blue-200 opacity-30" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-teal-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        <motion.div 
          className="text-center relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Health Journey Starts Here
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Manage your health records, book appointments, and track your wellness journey.
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-teal-600 text-white px-8 py-3 rounded-md text-lg hover:bg-teal-700 transition-colors"
          >
            Get Started
          </button>
        </motion.div>
      </div>

      {/* Statistics Section with Animated Counters */}
      <div className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4" />
                <motion.h3 className="text-4xl font-bold mb-2">
                  {typeof stat.number === 'number' ? 
                    useCountAnimation(stat.number) : stat.number}
                  {stat.label === "Satisfaction Rate" && "%"}
                </motion.h3>
                <p className="text-teal-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid with Hover Effects */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((Feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Feature.icon className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{Feature.title}</h3>
              <p className="text-gray-600">{Feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Slider */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What People Say</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-6">
                <img 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{testimonials[currentTestimonial].name}</h3>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">{testimonials[currentTestimonial].text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full ${
                  currentTestimonial === index ? 'bg-teal-600' : 'bg-teal-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Health Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map((news, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center mb-2">
                <span className="text-sm text-teal-600 font-medium">{news.category}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{news.date}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
              <p className="text-gray-600">{news.preview}</p>
              <motion.button
                whileHover={{ x: 5 }}
                className="mt-4 text-teal-600 font-medium flex items-center"
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <achievement.icon className="w-12 h-12 mx-auto text-teal-600 mb-4" />
                <h3 className="text-lg font-semibold">{achievement.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="bg-teal-600 text-white py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Health Journey Today</h2>
          <p className="mb-8 text-teal-100">Join thousands of users who trust us with their health</p>
          <motion.button
            onClick={() => navigate('/signup')}
            className="bg-white text-teal-600 px-8 py-3 rounded-md text-lg hover:bg-teal-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Appointment Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-teal-600 text-white p-4 rounded-full shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/schedule')}
      >
        <Calendar className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
