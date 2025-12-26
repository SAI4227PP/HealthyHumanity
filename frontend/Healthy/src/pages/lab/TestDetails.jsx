import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, FileText, DollarSign, Activity, Check, X } from 'lucide-react';
import { getAuthHeaders, getLabData } from '../../utils/authUtils';
import { toast } from 'react-toastify';
import ReportForm from '../../components/lab/ReportForm';

const TestDetails = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: ''  // Remove other fields, keep only status
  });

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const labData = getLabData();
        if (!labData?.id) throw new Error('Lab authentication required');

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/lab/test-details/${testId}`,
          { headers: getAuthHeaders() }
        );

        if (!response.ok) throw new Error('Failed to fetch test details');

        const { data } = await response.json();
        setTest(data);
      } catch (error) {
        toast.error(error.message);
        console.error('Error fetching test details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId]);

  const handleUpdateStatus = async () => {
    try {
      const labData = getLabData();
      if (!labData?.id) throw new Error('Lab authentication required');

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/lab/update-test/${testId}`,
        {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...updateData,
            labId: labData.id
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update test');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Test status updated successfully');
        setIsUpdateModalOpen(false);
        // Update local state with new data
        setTest(prevTest => ({
          ...prevTest,
          status: updateData.status.toLowerCase(),
          doctor: updateData.doctor,
          reportStatus: {
            ...prevTest.reportStatus,
            status: updateData.status,
            doctor: updateData.doctor,
            results: updateData.results
          }
        }));
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Update status error:', error);
    }
  };

  const UpdateStatusModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Update Test Status</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={updateData.status}
              onChange={(e) => setUpdateData({ status: e.target.value })}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Started">Started</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleReportSuccess = (updatedTest) => {
    setTest(updatedTest);
    setIsReportFormOpen(false);
  };

  const getStatusDisplay = (status) => {
    // Removed the status null check to avoid showing 'Unknown'
    return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Started';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'started':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-blue-100 text-blue-800'; // Default to Started status style
    }
  };

  const renderTestDetails = () => {
    if (!test || !test.patient) {
      return (
        <div className="text-gray-500">Loading patient details...</div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-gray-600">
          Name: <span className="text-gray-900">{test.patient.name}</span>
        </p>
        <p className="text-gray-600">
          Email: <span className="text-gray-900">{test.patient.email}</span>
        </p>
        <p className="text-gray-600">
          Phone: <span className="text-gray-900">{test.patient.phone}</span>
        </p>
        {test.patient.details && test.patient.details.age && (
          <p className="text-gray-600">
            Age: <span className="text-gray-900">{test.patient.details.age}</span>
          </p>
        )}
        {test.patient.details && test.patient.details.gender && (
          <p className="text-gray-600">
            Gender: <span className="text-gray-900">{test.patient.details.gender}</span>
          </p>
        )}
      </div>
    );
  };

  const renderReportStatus = () => {
    if (!test?.report) return null;

    return (
      <div className="space-y-2">
        {test.report.parameters && test.report.parameters.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Test Parameters</h4>
            <div className="bg-white rounded-lg border">
              {test.report.parameters.map((param, idx) => (
                <div key={idx} className="p-3 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{param.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      param.status === 'normal' ? 'bg-green-100 text-green-800' :
                      param.status === 'high' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {param.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {param.value} {param.unit} (Range: {param.range})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProgressIcon = (step, currentStatus) => {
    const status = currentStatus?.toLowerCase();
    
    if (step === 'booking') {
      return <Check className="w-5 h-5 text-green-500 mr-2" />;
    }
    
    if (step === 'collection') {
      if (status === 'started' || status === 'completed') {
        return <Check className="w-5 h-5 text-green-500 mr-2" />;
      }
      return <Clock className="w-5 h-5 text-yellow-500 mr-2" />;
    }
    
    if (step === 'report') {
      if (status === 'completed') {
        return <Check className="w-5 h-5 text-green-500 mr-2" />;
      }
      return <X className="w-5 h-5 text-gray-300 mr-2" />;
    }
  };

  const renderProgressText = (step, currentStatus) => {
    const status = currentStatus?.toLowerCase();
    
    if (step === 'collection') {
      if (status === 'started' || status === 'completed') {
        return "Sample Collected";
      }
      return "Sample Collection Pending";
    }
    
    if (step === 'report') {
      if (status === 'completed') {
        return "Report Generated";
      }
      return "Report Generation Pending";
    }
    
    return "Booking Confirmed";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Test details not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tests
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Test Details</h1>
              <p className="text-gray-600">Test ID: #{testId}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Update Status
              </button>
              <button
                onClick={() => setIsReportFormOpen(true)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={test?.reportStatus?.reportGenerated}
              >
                {test?.reportStatus?.reportGenerated ? 'Report Generated' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                Patient Information
              </h3>
              {renderTestDetails()}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-500" />
                Test Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Test Type: <span className="text-gray-900">{test.test?.name || 'N/A'}</span>
                </p>
                <p className="text-gray-600">
                  Price: <span className="text-gray-900">₹{test.test?.price || 'N/A'}</span>
                </p>
                <p className="text-gray-600">
                  Status:
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getStatusColor(test.report?.status || test.status)}`}>
                    {getStatusDisplay(test.report?.status || test.status)}
                  </span>
                </p>
                {test.report && renderReportStatus()}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                Appointment Details
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">Requested Date: <span className="text-gray-900">16/2/2025</span></p>
                <p className="text-gray-600">Booking Time: <span className="text-gray-900">10:30 AM</span></p>
                <p className="text-gray-600">Doctor: <span className="text-gray-900">{test.doctor || 'Not assigned'}</span></p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-gray-500" />
                Test Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  {renderProgressIcon('booking', test.report?.status || test.status)}
                  <span className="text-gray-600">Booking Confirmed</span>
                </div>
                <div className="flex items-center">
                  {renderProgressIcon('collection', test.report?.status || test.status)}
                  <span className={`text-gray-600 ${
                    (test.report?.status === 'started' || test.report?.status === 'completed') 
                      ? 'text-green-600' 
                      : ''
                  }`}>
                    {renderProgressText('collection', test.report?.status || test.status)}
                  </span>
                </div>
                <div className="flex items-center">
                  {renderProgressIcon('report', test.report?.status || test.status)}
                  <span className={`${
                    test.report?.status === 'completed' 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`}>
                    {renderProgressText('report', test.report?.status || test.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isUpdateModalOpen && <UpdateStatusModal/>}
      {isReportFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[900px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generate Test Report</h3>
              <button
                onClick={() => setIsReportFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ReportForm
              testId={testId}
              testName={test.test?.name || 'Unknown Test'}
              onSuccess={handleReportSuccess}
              onCancel={() => setIsReportFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDetails;
