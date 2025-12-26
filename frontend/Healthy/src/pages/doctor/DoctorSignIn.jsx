import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDoctor } from '../../context/DoctorContext';

const DoctorSignIn = () => {
  const { doctorId } = useParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginDoctor } = useDoctor();

  useEffect(() => {
    if (doctorId) {
      fetchDoctorEmail();
    }
  }, [doctorId]);

  const fetchDoctorEmail = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/doctors/${doctorId}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          email: data.doctor.contact?.email || '' // Update to use contact.email
        }));
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      toast.error('Failed to load doctor details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', { 
        email: formData.email, 
        doctorId 
      });

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/doctors/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          doctorId: doctorId
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        // Verify role
        if (data.doctor.role !== 'doctor') {
          toast.error('Invalid account type');
          return;
        }

        // Use context to handle login
        await loginDoctor(data.token, data.doctor);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
            Doctor Sign In
          </h2>
          <p className="text-center text-sm text-gray-600">
            Welcome back, Doctor! Please enter your credentials
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-t-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {doctorId && !formData.email && (
                <p className="mt-1 text-sm text-gray-500">
                  Please enter your email address to continue
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-b-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/doctor/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignIn;
