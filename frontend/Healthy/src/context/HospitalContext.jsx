import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('hospitalToken');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/hospital/verify`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Token verification failed');
      
      const data = await response.json();
      setHospital(data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('hospitalToken');
      setIsAuthenticated(false);
    }
  };

  const signup = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/hospital/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('hospitalToken', `Bearer ${data.token}`);
      setHospital(data.hospital);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/hospital/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store the complete token with 'Bearer' prefix
      localStorage.setItem('hospitalToken', `Bearer ${data.token}`);
      setHospital(data.hospital);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('hospitalToken');
      if (token) {
        await fetch(`${import.meta.env.VITE_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('hospitalToken');
      setHospital(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('hospitalToken');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/hospital/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      setHospital(data);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <HospitalContext.Provider 
      value={{ 
        hospital, 
        loading, 
        error, 
        isAuthenticated, 
        signup, 
        login, 
        logout,
        updateProfile
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => useContext(HospitalContext);

export const ProtectedHospitalRoute = ({ children }) => {
  const { isAuthenticated, loading } = useHospital();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/hospital/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? children : null;
};
