import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader } from "lucide-react"; // Import the right arrow icon
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';


const MedicalTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // State to toggle between showing 5 or all tests

  const navigate = useNavigate();


  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tests/top-booked`);
        const data = await response.json();
        
        if (data.success) {
            setTests(data.data.slice(0, 4)); // Limit to top 4 tests
            if (data.data.length === 0) {
            console.info('No booked tests available');
          }
        } else {
          console.error('Failed to fetch tests:', data.message);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleBookNowClick = (testId) => {
    navigate(`/dashboard/test/${testId}`);
  };

  const handleShowMore = () => {
    setShowAll(!showAll); // Toggle the value of showAll
  };

  const categories = [
    { name: "Women's Health", image: "https://images.apollo247.in/pd-cms/cms/2024-01/WOMEN'S%20HEALTH.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Thyroid", image: "https://images.apollo247.in/pd-cms/cms/2024-01/Thyroid.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Vitamin", image: "https://images.apollo247.in/pd-cms/cms/2024-01/VITAMIN.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Blood Studies", image: "https://images.apollo247.in/pd-cms/cms/2024-01/Blood%20Studies%20(Anemia).png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Hairfall", image: "https://images.apollo247.in/pd-cms/cms/2024-01/Hairfall.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Heart", image: "https://images.apollo247.in/pd-cms/cms/2024-01/Heart%20(Cardiac).png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Kidney", image: "https://images.apollo247.in/pd-cms/cms/2024-01/Fever.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Liver", image: "https://images.apollo247.in/pd-cms/cms/2024-01/Liver.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Fever", image: "https://images.apollo247.in/pd-cms/cms/2024-01/Fever.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Hormone", image: "https://images.apollo247.in/pd-cms/cms/2024-01/HORMONE.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max 50w" },
    { name: "Senior Citizen", image: "https://images.apollo247.in/pd-cms/cms/2024-01/Senior_Citizen.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" },
    { name: "Dengue", image: "https://images.apollo247.in/pd-cms/cms/2023-10/Fever_1.png?tr=q-80,f-webp,w-50,dpr-1,c-at_max" }
  ];

  return (
    <motion.div 
      className="w-full bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-[2000px] mx-auto px-4 py-6">
        {/* Categories Section */}
        <div className="flex justify-between items-center mb-8">
  <h1 className="text-2xl sm:text-3xl font-bold text-teal-700 pl-10 sm:pl-0">
    Doctor Created Health Checks
  </h1>
</div>


        {/* Update category cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.div 
              key={index}
              className="p-4 border rounded-lg shadow-md flex items-center justify-center bg-white hover:bg-teal-50 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="mr-4 w-10 h-10 object-contain"
                onError={(e) => e.target.src = '/images/default.png'} // Fallback image
              />
              <div className="text-center">
                {category.name.includes(' ') ? (
                  category.name.split(' ').map((word, i) => (
                    <p key={i} className="text-sm font-semibold ml-2">{word}</p>
                  ))
                ) : (
                  <p className="text-sm font-semibold">{category.name}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tests.map((test, index) => (
            <motion.div 
              key={test._id}
              className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-all bg-white"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-teal-600 text-xl font-bold">
                    #{test.bookings}
                  </span>
                </div>
                <h3 className="text-xl font-semibold flex-1">{test.name}</h3>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{test.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-teal-600">₹{test.price}</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm">
                  {test.category}
                </span>
              </div>

              <button 
                className="w-full mt-4 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors"
                onClick={() => handleBookNowClick(test._id)} // Pass test._id to navigate
              >
                Book Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* Show empty state if no tests */}
        {!loading && tests.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600">No top booked tests available</p>
          </div>
        )}

        {/* Upload and Orders section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Update card styles */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center flex-1">
              {/* Image */}
              <div className="w-24 flex-shrink-0">
                <img
                  src="https://images.apollo247.in/images/ui-revamp-noncart-icon.svg?tr=q-80,w-100,dpr-1,c-at_max"
                  alt="Upload and Order"
                  className="w-full h-auto"
                />
              </div>
              {/* Text Content */}
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-bold mb-2">Upload and Order</h2>
                <p className="text-gray-600">
                  Upload your doctor's prescription or medical records and place an order.
                </p>
              </div>
            </div>
            {/* Icon aligned to the right */}
            <div className="ml-4">
              <ArrowRight className="text-teal-600 w-6 h-6 cursor-pointer hover:text-teal-700 transition-colors" />
            </div>
          </div>

          {/* View Your Orders */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center flex-1">
              {/* Image */}
              <div className="w-24 flex-shrink-0">
                <img
                  src="https://images.apollo247.in/images/icons/view-reports.svg?tr=q-80,w-100,dpr-1,c-at_max"
                  alt="View Your Orders"
                  className="w-full h-auto"
                />
              </div>
              {/* Text Content */}
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-bold mb-2">View Your Orders</h2>
                <p className="text-gray-600">
                  Track your orders and view details of your previous bookings.
                </p>
              </div>
            </div>
            {/* Icon aligned to the right */}
            <div className="ml-4">
              <ArrowRight className="text-teal-600 w-6 h-6 cursor-pointer hover:text-teal-700 transition-colors" />
            </div>
          </div>
        </div>

        {/* Thrid Section: Popular Health Checkup Packages  */}
        <div className="flex justify-between items-center mb-8 mt-5">
          <h1 className="text-3xl font-bold">Popular Health Checkup Packages </h1>
        </div>

        {loading ? (
  <div className="flex justify-center items-center py-8">
    <Loader className="animate-spin w-6 h-6 text-teal-600" />
    <span className="ml-2 text-teal-700 font-medium">Loading...</span>
  </div>
) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {tests.map((test, index) => (
              <motion.div 
                key={test._id}
                className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-all bg-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-teal-600 text-xl font-bold">
                      #{test.bookings}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold flex-1">{test.name}</h3>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{test.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-teal-600">₹{test.price}</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm">
                    {test.category}
                  </span>
                </div>

                <button 
                  className="w-full mt-4 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Book Now
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Show empty state if no tests */}
        {!loading && tests.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600">No Popular Health Checkup Packages available</p>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default MedicalTestsPage;
