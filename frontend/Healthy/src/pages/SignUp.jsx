import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Function to validate the Gmail email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@gmail\.com$/;  // Ensure it's a valid Gmail address
  return re.test(String(email).toLowerCase());
};

// Function to extract the part before "@" in the email (for uniqueName)
const generateUniqueName = (gmail) => {
  const prefix = gmail.split('@')[0];  // Get the part before "@"
  return prefix;
};

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: 'https://th.bing.com/th/id/OIP.yd94h9eJxZuHPrDg31LkiQHaHa?w=500&h=500&rs=1&pid=ImgDetMain'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid Gmail address');
      setLoading(false);
      return;
    }

    // Generate uniqueName from the email
    const uniqueName = generateUniqueName(formData.email);

    // Create a request body without confirmPassword
    const requestBody = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword, // Include this for backend validation
      avatar: formData.avatar,
      uniqueName: uniqueName  // Add uniqueName to the request body
    };

    try {
      console.log('Sending signup request:', { ...requestBody, password: '***' });
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Signup response:', { ...data, token: '***' });

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      login(data.user, data.token);
      navigate('/dashboard/home');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Soft, soothing background effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-300 opacity-20 rounded-full blur-xl"
        style={{ animation: 'softWave 5s ease-in-out infinite' }}
      ></motion.div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center sm:order-last sm:mb-6"
        >
          <h2 className="text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-200">
            Already have an account?{' '}
            <Link to="/signin" className="text-teal-200 hover:text-teal-100">
              Sign in
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white bg-opacity-90 py-8 px-6 sm:px-10 shadow sm:rounded-lg"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-4 p-2 text-red-500 bg-red-100 rounded"
            >
              {error}
            </motion.div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 px-4 py-2"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 px-4 py-2"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 px-4 py-2"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 px-4 py-2"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
