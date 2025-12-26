import React, { useState, useEffect } from 'react';
import { WifiOff } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const NetworkError = () => {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);

  // Simulate an API call to check network status (can be replaced with your actual network check)
  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        // Example fetch request
        const response = await fetch('https://example.com/api');
        if (!response.ok) {
          throw new Error('Network error occurred');
        }
      } catch (error) {
        console.error('Network Error:', error);
        setHasError(true); // Update state to show network error message
      }
    };

    checkNetworkStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {hasError ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
          <WifiOff className="w-16 h-16 mx-auto text-teal-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h1>
          <p className="text-gray-600 mb-6">
            Oops! It seems there's a problem with your internet connection.
            Please check your network and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg mr-4 hover:bg-teal-700 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default NetworkError;
