import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Cpu } from 'react-feather';  // Changed Bot to Cpu
import { useNavigate } from 'react-router-dom';
import { generateResponse, initializeChatSession } from '../services/geminiService';

const AiAssistant = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        initializeChatSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages([...messages, { sender: 'user', text: userMessage }]);
        setIsTyping(true);

        try {
            const botResponse = await generateResponse(userMessage);
            
            // Check for navigation commands in the response
            const lowercaseResponse = botResponse.toLowerCase();
            if (lowercaseResponse.includes('navigate to') || lowercaseResponse.includes('going to')) {
                if (lowercaseResponse.includes('test')) {
                    navigate('/dashboard/tests');
                } else if (lowercaseResponse.includes('home')) {
                    navigate('/dashboard/home');
                } else if (lowercaseResponse.includes('reminder')) {
                    navigate('/dashboard/medication-reminders');
                } else if (lowercaseResponse.includes('teleconsult')) {
                    navigate('/dashboard/teleconsult');
                } else if (lowercaseResponse.includes('emergency')) {
                    navigate('/dashboard/emergency');
                } else if (lowercaseResponse.includes('schedule test')) {
                    navigate('/dashboard/schedule-test');
                } else if (lowercaseResponse.includes('metrics')) {
                    navigate('/dashboard/health-metrics');
                } else if (lowercaseResponse.includes('diet')) {
                    navigate('/dashboard/diet-plan');
                } else if (lowercaseResponse.includes('exercise')) {
                    navigate('/dashboard/exercise-log');
                } else if (lowercaseResponse.includes('vaccination')) {
                    navigate('/dashboard/vaccination-schedule');
                } else if (lowercaseResponse.includes('articles')) {
                    navigate('/dashboard/health-articles');
                } else if (lowercaseResponse.includes('profile')) {
                    navigate('/dashboard/health-profile');
                } else if (lowercaseResponse.includes('appointments')) {
                    navigate('/dashboard/appointments');
                } else if (lowercaseResponse.includes('reports')) {
                    navigate('/dashboard/my-reports');
                } else if (lowercaseResponse.includes('medicines')) {
                    navigate('/dashboard/medicines-used');
                } else if (lowercaseResponse.includes('hospital')) {
                    navigate('/dashboard/hospital-search');
                }
            }

            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponse }]);
        } catch (error) {
            console.error('Error:', error);
            if (!navigator.onLine || error.message.includes('network')) {
                navigate('/network-error');
                return;
            }
            setMessages(prevMessages => [...prevMessages, { 
                sender: 'bot', 
                text: 'Sorry, I encountered an error. Please try again.' 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden relative min-h-screen">
            {/* Header */}
            <div className="p-4 text-white flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" />
                <h1 className="text-xl text-teal-600 font-semibold">Health AI Assistant</h1>
            </div>
            {/* Body - Updated with icons and names */}
            <div className="flex-1 p-4 overflow-y-auto mb-20">
                {/* Welcome message */}
                {messages.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-xl text-gray-600 font-medium">How can I assist you today?</p>
                    </div>
                )}
                <div className="flex flex-col space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} 
                             className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex items-end space-x-2">
                                {message.sender === 'bot' && (
                                    <div className="flex flex-col items-center mb-2 mr-2">
                                        <Cpu className="w-8 h-8 text-teal-600 bg-gray-100 rounded-full p-1" />
                                        <span className="text-xs text-gray-500 mt-1">AI Assistant</span>
                                    </div>
                                )}
                                <div className={`max-w-[75%] p-3 rounded-2xl ${
                                    message.sender === 'user' 
                                    ? 'bg-teal-600 text-white rounded-tr-none' 
                                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                }`}>
                                    {message.text}
                                </div>
                                {message.sender === 'user' && (
                                    <div className="flex flex-col items-center mb-2 ml-2">
                                        <User className="w-8 h-8 text-white bg-teal-600 rounded-full p-1" />
                                        <span className="text-xs text-gray-500 mt-1">You</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-end space-x-2">
                                <div className="flex flex-col items-center mb-2 mr-2">
                                    <Cpu className="w-8 h-8 text-teal-600 bg-gray-100 rounded-full p-1" />
                                    <span className="text-xs text-gray-500 mt-1">HealthyAI</span>
                                </div>
                                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[75%]">
                                    HealthyAI is typing...
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Updated Footer with better responsive design */}
            <form onSubmit={handleSubmit} 
                  className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg z-50
                            sm:left-0 md:left-64 lg:left-72 
                            transition-all duration-300">
                <div className="max-w-4xl mx-auto w-full flex items-center gap-2
                              px-2 sm:px-4 md:px-6 lg:px-8">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg
                                 text-sm sm:text-base
                                 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Type your message..."
                    />
                    <button type="submit" 
                            className="px-3 sm:px-4 py-2 sm:py-3 bg-teal-600 text-white rounded-lg
                                     hover:bg-teal-700 transition-colors
                                     text-sm sm:text-base
                                     flex-shrink-0">
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AiAssistant;
