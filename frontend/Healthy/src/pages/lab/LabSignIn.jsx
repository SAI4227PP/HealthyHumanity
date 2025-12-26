import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setLabToken } from '../../utils/authUtils';

const LabSignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      if (data.token && data.lab) {
        // Store token
        setLabToken(data.token);
        
        // Store lab details in localStorage under 'lab' key instead of 'user'
        const labData = {
          id: data.lab.id,
          email: data.lab.email,
          labName: data.lab.labName,
          type: 'lab',
          role: 'lab'
        };
        
        localStorage.setItem('lab', JSON.stringify(labData));
        console.log('Lab signin successful:', labData);

        navigate('/lab/home');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
          Lab Sign In
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/lab/signup" className="text-purple-600 hover:text-purple-700">
            Need an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LabSignIn;

