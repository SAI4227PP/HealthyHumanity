import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { generateResponse } from '../services/geminiService';
import { Loader, CheckCircle } from 'lucide-react'; // Add CheckCircle to imports

const TestDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiInsights, setShowAiInsights] = useState(false);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/test-details/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setTestDetails(data.data);
          generateTestInsights(data.data); // Only generate main test insights
        } else {
          setError('Failed to fetch test details');
        }
      } catch (error) {
        setError('Error fetching test details.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  const generateTestInsights = async (testData) => {
    if (!testData?.name) return;
    
    try {
      setAiLoading(true);
      setShowAiInsights(true);
      const prompt = `You are a medical professional explaining ${testData.name} to a patient.
      
      Present the following information in clear, plain language without any special characters or formatting:

      Begin with a brief overview of the test.
      Then explain:
      1. The purpose of this test in everyday terms
      2. What the test measures and its importance
      3. Normal ranges and their health implications
      4. Common conditions this test helps identify
      5. Brief preparation instructions if needed

      Important:
      - Use simple, direct language
      - Avoid asterisks, special characters, or markdown formatting
      - Explain medical terms in plain language using parentheses
      - Keep the tone professional but approachable
      - Format in clear paragraphs
      - Do not use any greetings or conversation starters`;

      const response = await generateResponse(prompt);
      // Clean up any remaining special characters
      const cleanResponse = response.replace(/[\*\#\@\^\~]/g, '');
      setAiResponse(cleanResponse);
    } catch (error) {
      console.error('Error getting AI insights:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleBookTest = async () => {
    try {
      if (!user || !user.id) {
        setError('Please login to book a test');
        return;
      }

      setLoading(true);
      setError(null);

      // Update the API URL to use environment variable
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/test-details/${id}/book`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          userId: user.id,
          testId: id
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Failed to book the test');
        } catch (e) {
          throw new Error('Server returned an invalid response');
        }
      }

      const data = await response.json();
      
      if (data.success) {
        setIsBooked(true);
        console.log('Booking successful:', data); // For debugging
      } else {
        throw new Error(data.message || 'Failed to book the test');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Error booking the test. Please try again.');
      setIsBooked(false);
    } finally {
      setLoading(false);
    }
  };

  // Update the booking button section
  const renderBookingSection = () => (
    <div className="mt-6">
      {isBooked ? (
        <div className="flex items-center gap-2 text-green-600 font-semibold mb-4">
          <CheckCircle className="w-5 h-5" />
          <span>Test successfully booked!</span>
        </div>
      ) : (
        <button 
          className={`w-full md:w-auto px-6 py-3 rounded-md transition duration-300 flex justify-center mx-auto items-center gap-2
            ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'} text-white`}
          onClick={handleBookTest}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="animate-spin w-4 h-4" />
              <span>Booking...</span>
            </>
          ) : (
            'Book Now'
          )}
        </button>
      )}
      {error && !isBooked && (
        <div className="mt-2 text-center text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="flex justify-center items-center py-8">
      <Loader className="animate-spin w-6 h-6 text-teal-600" />
      <span className="ml-2 text-teal-700 font-medium">Loading...</span>
    </div>;
  if (error) return <div className="text-center text-xl text-red-500">{error}</div>;
  if (!testDetails) return <div className="text-center text-xl">Test details not found.</div>;

  return (
    <div className="flex flex-col md:gap-12 gap-6 mt-6 mx-auto p-6 max-w-5xl">
      {/* Test Details Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Test Info */}
        <div className="w-full md:w-2/3 bg-white p-6 shadow-md rounded-lg m-4 h-[430px] ml-0 flex flex-col sm:h-[350px]">
          <h1 className="text-3xl font-bold text-teal-700">{testDetails.name}</h1>
          <p className="mt-2 text-gray-600 italic">{testDetails.alsoKnownAs}</p>
          <p><strong>description :</strong> <span className="text-teal-600 pt-2">{testDetails.description}</span></p>

          <div className="mt-4 space-y-2">
            <p><strong>sampleType :</strong> <span className="text-teal-600">{testDetails.sampleType}</span></p>
            <p><strong>category :</strong> <span className="text-teal-600">{testDetails.category}</span></p>
            <p><strong>results :</strong> <span className="text-teal-600">{testDetails.results}</span></p>
            <p><strong>Reports:</strong> <span className="text-teal-600">Within {testDetails.reportTime} H</span></p>
            <p><strong>Preparation:</strong> <span className="text-teal-600">{testDetails.preparation || "No preparation required"}</span></p>
          </div>

          {renderBookingSection()}
        </div>

        {/* Right Side - Included Tests with Scroll - Simplified */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-sm m-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Test(s) Included ({testDetails.includedTests?.length || 0})
            </h2>
            <div 
              className="cursor-pointer text-teal-600 ml-2"
              onClick={() => setIsListVisible(!isListVisible)} 
            >
              {isListVisible ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>

          {isListVisible && (
            <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-teal-100 pr-2">
              <ul className="space-y-2">
                {testDetails.includedTests?.length > 0 ? (
                  testDetails.includedTests.map((test, index) => (
                    <li 
                      key={index} 
                      className="text-gray-700 border-b pb-2 last:border-b-0 hover:bg-white hover:shadow-sm transition-all duration-200 rounded p-2"
                    >
                      {test}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No included tests available.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="w-full bg-gradient-to-r from-teal-50 to-white p-6 rounded-lg shadow-md mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-teal-700">AI Health Insights</h2>
          {aiLoading && (
            <div className="flex items-center text-teal-600">
              <Loader className="animate-spin w-5 h-5 mr-2" />
              <span className="text-sm">Generating insights...</span>
            </div>
          )}
        </div>
        
        {aiResponse ? (
          <div className="prose max-w-none">
            {aiResponse.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>
            ))}
          </div>
        ) : !aiLoading && (
          <div className="bg-teal-50 p-4 rounded-md">
            <p className="text-teal-600">AI insights are being generated in the background...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDetailsPage;
