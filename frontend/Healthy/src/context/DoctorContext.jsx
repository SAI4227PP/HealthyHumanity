import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkDoctorAuth();
  }, []);

  const checkDoctorAuth = () => {
    try {
      const doctorInfo = localStorage.getItem('doctorInfo');
      const doctorToken = localStorage.getItem('doctorToken');

      if (doctorInfo && doctorToken) {
        setDoctor(JSON.parse(doctorInfo));
      }
    } catch (error) {
      console.error('Error checking doctor auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginDoctor = async (token, doctorData) => {
    try {
      localStorage.setItem('doctorToken', token);
      localStorage.setItem('doctorInfo', JSON.stringify(doctorData));
      setDoctor(doctorData);
      toast.success('Successfully signed in');
      navigate('/doctor/home');
    } catch (error) {
      console.error('Error logging in doctor:', error);
      toast.error('Failed to complete login');
    }
  };

  const logoutDoctor = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorInfo');
    setDoctor(null);
    navigate('/doctor/signin');
    toast.success('Successfully logged out');
  };

  const updateDoctorProfile = (updatedData) => {
    try {
      const updatedDoctor = { ...doctor, ...updatedData };
      localStorage.setItem('doctorInfo', JSON.stringify(updatedDoctor));
      setDoctor(updatedDoctor);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const value = {
    doctor,
    loading,
    loginDoctor,
    logoutDoctor,
    updateDoctorProfile
  };

  return (
    <DoctorContext.Provider value={value}>
      {!loading && children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};

export default DoctorContext;
