import React, { useState } from "react";
import { generateResponse } from "../services/geminiService1";
import ReactMarkdown from 'react-markdown';
import { FiUpload, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { FaNotesMedical, FaFileMedical } from 'react-icons/fa';  // Add these imports

export default function ReportAnalysis() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractingText, setExtractingText] = useState(false);
  const [analyzingReport, setAnalyzingReport] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setImagePreview(URL.createObjectURL(uploadedFile));
    setExtractingText(true);  // Set extracting state
    extractTextFromImage(uploadedFile);
  };

  const extractTextFromImage = async (file) => {
    setLoading(true);
    setExtractingText(true);
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      setText("Error: Please upload a valid image file (JPEG, PNG)");
      setLoading(false);
      setExtractingText(false);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setText("Error: Image file size must be less than 4MB");
      setLoading(false);
      setExtractingText(false);
      return;
    }

    try {
      const response = await generateResponse(
        "Please analyze this medical report image. Extract all visible text and medical data. Format the output as a clear, structured list.",
        file
      );

      if (!response) {
        throw new Error("No text could be extracted from the image");
      }

      setText(response);
    } catch (error) {
      console.error("Image analysis error:", error);
      setText(error.message);
    } finally {
      setLoading(false);
      setExtractingText(false);
    }
  };

  const analyzeReport = async () => {
    if (!text) {
      alert("Please upload a report first.");
      return;
    }
    setLoading(true);
    setAnalyzingReport(true);

    try {
      const response = await generateResponse(`
        Analyze this medical report data and provide a structured response:
        1. Key Measurements & Results
        2. Abnormal Findings (if any)
        3. Normal Range References
        4. Recommendations

        Report Content:
        ${text}
      `);

      if (!response) {
        throw new Error("Could not generate analysis");
      }

      setAnalysis(response);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis(`Analysis Error: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
      setAnalyzingReport(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setText("");
    setAnalysis("");
    setImagePreview(null);
    setExtractingText(false);
    setAnalyzingReport(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <FaNotesMedical className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                Medical Report Analysis
              </h1>
              <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                <FaFileMedical className="text-blue-500" />
                Upload your medical report for AI-powered analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {!file ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Medical Report
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".txt,.pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="relative flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-400 focus:outline-none"
                    >
                      <span className="flex items-center space-x-2">
                        <FiUpload className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-600">
                          Drop files to Attach, or{" "}
                          <span className="text-blue-600">browse</span>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiFileText />
                    <span>{file.name}</span>
                  </div>
                  <button
                    onClick={resetAnalysis}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Upload Different Report
                  </button>
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Report Preview"
                    className="w-full rounded-lg border mt-4"
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {extractingText && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Extracting Text...</h3>
                  <div className="animate-pulse flex items-center space-x-2 text-blue-600">
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce delay-100"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce delay-200"></div>
                  </div>
                </div>
                <div className="h-20 flex items-center justify-center">
                  <div className="text-gray-500">Processing your medical report...</div>
                </div>
              </div>
            )}

            {analyzingReport && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Analyzing Report...</h3>
                  <div className="animate-pulse flex items-center space-x-2 text-blue-600">
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce delay-100"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce delay-200"></div>
                  </div>
                </div>
                <div className="h-20 flex items-center justify-center">
                  <div className="text-gray-500">Processing analysis, please wait...</div>
                </div>
              </div>
            )}

            {text && !loading && !extractingText && !analyzingReport && (
              <button
                onClick={analyzeReport}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Analyze Report
              </button>
            )}

            {analysis && !analyzingReport && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              </div>
            )}

            {text && !extractingText && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Extracted Text</h3>
                </div>
                <div className="prose max-w-none">
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
              </div>
            )}

            {text && text.includes("Error") && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-400" />
                  <p className="ml-3 text-sm text-red-700">{text}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
