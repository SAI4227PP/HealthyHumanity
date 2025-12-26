import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye, Calendar, Loader, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ReportViewer from '../components/reports/ReportViewer';

const MyReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]); // Store reports
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Store errors
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/test-report/${user.id}/booked-tests`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('API Response:', {
          success: data.success,
          totalReports: data.data?.length || 0,
          firstReport: data.data?.[0] || null
        });

        if (data.success) {
          setReports(data.data);
        } else {
          console.error('API returned success: false');
          setReports([]);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err.message);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="animate-spin w-6 h-6 text-teal-600" />
        <span className="ml-2 text-teal-700 font-medium">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  const NoReportsTemplate = () => {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-md">
        <ClipboardList className="w-16 h-16 mx-auto text-teal-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800">No Reports Found</h2>
        <p className="text-gray-600 mb-6">
          You haven't taken any medical tests yet. Book a test to start tracking your health.
        </p>
        <Link
          to="/dashboard/tests"
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          Book a Test
          <Calendar className="w-5 h-5 ml-2" />
        </Link>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      case 'started':  // Changed from 'Started' to 'started' to match toLowerCase()
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleViewReport = async (reportId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/lab/test-details/${reportId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
        }
      });

      if (!response.ok) throw new Error('Failed to fetch report details');

      const { data } = await response.json();
      setSelectedReport(data);
      setIsViewerOpen(true);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report');
    }
  };

  const renderReportActions = (report) => (
    <div className="flex space-x-2">
      {report.reportStatus?.status?.toLowerCase() === 'completed' && (
        <>
          <button
            onClick={() => handleViewReport(report._id)}
            className="p-2 text-teal-600 hover:bg-teal-50 rounded-full"
            title="View"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-teal-600 hover:bg-teal-50 rounded-full"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-teal-700 mb-4 flex items-center pl-9 sm:pl-0">
        <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        My Medical Reports
      </h1>
      <div className="grid gap-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <motion.div
              key={report._id}
              className="bg-white rounded-lg shadow-md p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {report.testDetails?.name || report.testName || 'Unknown Test'}
                  </h3>
                  {report.testDetails?.description && (
                    <p className="text-sm text-gray-500 mt-1">{report.testDetails.description}</p>
                  )}
                  {report.testDetails?.price && (
                    <p className="text-sm font-medium text-teal-600 mt-1">₹{report.testDetails.price}</p>
                  )}
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(report.reportDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {/* Add booking status details */}
                  {report.bookingStatus && (
                    <div className="mt-2 space-y-1 text-sm">
                      {report.bookingStatus.doctor && (
                        <p className="text-gray-600">Doctor: {report.bookingStatus.doctor}</p>
                      )}
                      {report.bookingStatus.laboratory && (
                        <p className="text-gray-600">Laboratory: {report.bookingStatus.laboratory}</p>
                      )}
                      {report.bookingStatus.expectedReportTime && (
                        <p className="text-gray-600">
                          Expected Report: {new Date(report.bookingStatus.expectedReportTime).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {renderReportActions(report)}
                  <span className={`text-sm font-medium ${getStatusColor(report.reportStatus?.status)}`}>
                    {report.reportStatus?.status || report.bookingStatus?.status || 'Pending'}
                  </span>
                </div>
              </div>
              
              {/* Update the bottom section to show booking details if available */}
              {(report.reportStatus?.laboratory || report.bookingStatus?.laboratory) && (
                <div className="mt-2 flex items-center text-sm text-gray-500 gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                    {report.reportStatus?.laboratory || report.bookingStatus?.laboratory}
                  </span>
                  {report.reportStatus?.fileSize && (
                    <span>{report.reportStatus.fileSize}</span>
                  )}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <NoReportsTemplate />
        )}
      </div>

      {/* Add the ReportViewer modal */}
      {isViewerOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Test Report</h2>
              <button
                onClick={() => setIsViewerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ReportViewer report={selectedReport} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;
