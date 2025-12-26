import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAuthHeaders, getLabData } from '../../utils/authUtils';
import { generateResponse } from '../../services/geminiService';

const ReportForm = ({ testId, testName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [testDetails, setTestDetails] = useState(null);

  // Add this new function to fetch test details
  const fetchTestDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lab/test-details/${testId}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error('Failed to fetch test details');

      const { data } = await response.json();
      setTestDetails(data);
    } catch (error) {
      toast.error('Error fetching test details: ' + error.message);
    }
  };

  useEffect(() => {
    fetchTestDetails();
  }, [testId]);

  // Add this new component for test information
  const TestInformation = () => (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Patient Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Name:</span>{' '}
              <span className="font-medium">{testDetails?.patient?.name}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Email:</span>{' '}
              <span className="font-medium">{testDetails?.patient?.email}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Phone:</span>{' '}
              <span className="font-medium">{testDetails?.patient?.phone}</span>
            </p>
          </div>
        </div>

        {/* Test Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test Information</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Test Name:</span>{' '}
              <span className="font-medium">{testDetails?.test?.name}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Category:</span>{' '}
              <span className="font-medium">{testDetails?.test?.category}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Lab:</span>{' '}
              <span className="font-medium">{testDetails?.lab?.name}</span>
            </p>
            <p className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
              testDetails?.reportStatus?.status === 'Completed' ? 'bg-green-100 text-green-800' :
              testDetails?.reportStatus?.status === 'Started' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {testDetails?.reportStatus?.status || 'Pending'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const generateTestReport = async () => {
    try {
      setLoading(true);
      console.log('Generating report for:', testName); // Debug log

      const prompt = `As a medical laboratory professional, generate a detailed test report for a ${testName}. Include:

1. List 5-6 key test parameters typical for ${testName}, with realistic:
- Parameter names
- Measured values
- Units
- Normal ranges
- Status (normal/high/low)

2. Provide a clinical diagnosis based on these values
3. List specific medical recommendations
4. Add technical notes about the test methodology

Format as JSON:
{
  "parameters": [
    {
      "name": string,
      "value": number,
      "unit": string,
      "range": string,
      "status": "normal" | "high" | "low"
    }
  ],
  "diagnosis": string,
  "recommendations": string,
  "technicalNotes": string
}`;

      console.log('Sending prompt:', prompt); // Debug log

      const response = await generateResponse(prompt);
      console.log('Raw Gemini response:', response); // Debug log

      // Handle potential non-JSON responses
      let parsedResponse;
      try {
        // Clean the response string if needed
        const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
        parsedResponse = JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Failed to parse response:', response);
        throw new Error('Invalid response format from AI');
      }

      console.log('Parsed response:', parsedResponse); // Debug log
      
      if (!parsedResponse.parameters || !parsedResponse.diagnosis) {
        throw new Error('Incomplete response from AI');
      }

      setGeneratedReport(parsedResponse);
      toast.success('Report template generated');

    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!generatedReport) {
      toast.error('Please generate the report first');
      return;
    }

    try {
      setLoading(true);
      const labData = getLabData();
      
      if (!labData?.id) {
        throw new Error('Lab authentication required');
      }

      const reportPayload = {
        labId: labData.id,
        reportData: {
          parameters: generatedReport.parameters,
          timestamp: new Date().toISOString(),
          testName: testName,
          patientName: testDetails?.patient?.name || 'Unknown Patient',
          labName: testDetails?.lab?.name || labData.labName,
          generatedAt: new Date().toISOString()
        },
        patientDetails: {
          name: testDetails?.patient?.name,
          patientId: testId,
          // Add any available age/gender from testDetails if available
        },
        testDetails: {
          testName: testName,
          sampleType: testName.toLowerCase().includes('blood') ? 'Blood Sample' : 
                     testName.toLowerCase().includes('urine') ? 'Urine Sample' : 'Laboratory Sample',
          collectionDate: new Date().toISOString()
        },
        diagnosis: generatedReport.diagnosis,
        recommendations: generatedReport.recommendations,
        technicalNotes: generatedReport.technicalNotes,
        authorizedBy: {
          name: testDetails?.lab?.name || labData.labName,
          role: 'Medical Laboratory'
        }
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lab/generate-report/${testId}`,
        {
          method: 'POST',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reportPayload)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Report generation failed:', error); // Debug log
        throw new Error(error.message || 'Failed to generate report');
      }

      const { data } = await response.json();
      
      // Fetch updated test details before calling onSuccess
      const updatedTestResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lab/test-details/${testId}`,
        { headers: getAuthHeaders() }
      );

      if (!updatedTestResponse.ok) {
        throw new Error('Failed to fetch updated test details');
      }

      const { data: updatedTest } = await updatedTestResponse.json();
      
      toast.success('Report generated successfully');
      onSuccess(updatedTest);
    } catch (error) {
      console.error('Report submission error:', error); // Debug log
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ReportPreview = () => (
    <div className="bg-white rounded-lg border">
      {/* Header Section */}
      <div className="p-6 border-b">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{testDetails?.lab?.name}</h2>
            <p className="text-gray-600">{testDetails?.lab?.email}</p>
            <p className="text-gray-600">{testDetails?.lab?.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Report Date: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">Report ID: #{testId.slice(-6)}</p>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="p-6 border-b bg-gray-50">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Patient Details</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-600 w-1/3">Name:</td>
                  <td className="py-1 font-medium">{testDetails?.patient?.name}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Age/Gender:</td>
                  <td className="py-1 font-medium">N/A</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Patient ID:</td>
                  <td className="py-1 font-medium">#{testId.slice(-8)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Test Details</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-600 w-1/3">Test Name:</td>
                  <td className="py-1 font-medium">{testDetails?.test?.name}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Sample Type:</td>
                  <td className="py-1 font-medium">
                    {testName.toLowerCase().includes('blood') ? 'Blood Sample' : 
                     testName.toLowerCase().includes('urine') ? 'Urine Sample' : 'Laboratory Sample'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Collection Date:</td>
                  <td className="py-1 font-medium">{new Date().toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {generatedReport && (
        <>
          {/* Parameters Table */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Test Parameters</h3>
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Test Parameter</th>
                  <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                  <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Reference Range</th>
                  <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {generatedReport.parameters.map((param, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border text-sm">{param.name}</td>
                    <td className="px-4 py-2 border text-sm font-medium">{param.value} {param.unit}</td>
                    <td className="px-4 py-2 border text-sm text-gray-600">{param.range}</td>
                    <td className="px-4 py-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${param.status === 'normal' ? 'bg-green-100 text-green-800' :
                          param.status === 'high' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {param.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interpretation */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Clinical Interpretation</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              {generatedReport.diagnosis}
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              {generatedReport.recommendations}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-sm text-gray-500">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-gray-700 mb-1">Technical Notes:</p>
                <p>{generatedReport.technicalNotes}</p>
              </div>
              <div className="text-right">
                <p className="mb-4">Authorized by:</p>
                <p className="font-medium text-gray-700">{testDetails?.lab?.name}</p>
                <p>Medical Laboratory</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {!generatedReport ? (
        <div className="text-center py-8">
          <button
            onClick={generateTestReport}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Generating Report...' : 'Generate AI Report'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <ReportPreview />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving Report...' : 'Save Final Report'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportForm;
