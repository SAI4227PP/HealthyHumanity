import React from 'react';

const ReportViewer = ({ report }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{report.lab?.name}</h2>
            <p className="text-gray-600">{report.lab?.email}</p>
            <p className="text-gray-600">{report.lab?.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Report Date: {formatDate(report.dates?.created)}</p>
            <p className="text-gray-600">Report ID: #{report.id?.slice(-6)}</p>
          </div>
        </div>
      </div>

      {/* Patient & Test Info */}
      <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold mb-3">Patient Details</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Name:</span>{' '}
              <span className="font-medium">{report.patient?.name}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Email:</span>{' '}
              <span className="font-medium">{report.patient?.email}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Phone:</span>{' '}
              <span className="font-medium">{report.patient?.phone}</span>
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Test Information</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Test Name:</span>{' '}
              <span className="font-medium">{report.test?.name}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Sample Type:</span>{' '}
              <span className="font-medium">{report.test?.sampleType}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Collection Date:</span>{' '}
              <span className="font-medium">{formatDate(report.test?.collectionDate)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Test Parameters */}
      {report.report?.parameters && report.report.parameters.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <h3 className="text-lg font-semibold p-4 bg-gray-50">Test Parameters</h3>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reference Range</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.report.parameters.map((param, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{param.name}</td>
                  <td className="px-4 py-2 font-medium">
                    {param.value} {param.unit}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{param.range}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
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
      )}

      {/* Clinical Interpretation */}
      {report.report?.diagnosis && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Clinical Interpretation</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            {report.report.diagnosis}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report.report?.recommendations && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Recommendations</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            {report.report.recommendations}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-6 mt-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            {report.report?.technicalNotes && (
              <>
                <p className="font-medium text-gray-700 mb-1">Technical Notes:</p>
                <p className="text-sm text-gray-600">{report.report.technicalNotes}</p>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="mb-2">Authorized by:</p>
            <p className="font-medium text-gray-700">{report.report?.authorizedBy?.name}</p>
            <p className="text-sm text-gray-600">{report.report?.authorizedBy?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
