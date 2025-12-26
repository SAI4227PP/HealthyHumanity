import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LabSignUp from './pages/lab/LabSignUp';
import HospitalDoctors from './pages/hospital/HospitalDoctors';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute';
import TestDetails from './pages/lab/TestDetails';
import { HospitalProvider, ProtectedHospitalRoute } from './context/HospitalContext';
import { DoctorProvider } from './context/DoctorContext';

// Lazy-loaded pages
const MedicalTestsPage = lazy(() => import('./pages/Tests'));
const HomePage = lazy(() => import('./pages/Home'));
const MedicationReminders = lazy(() => import('./pages/MedicationReminders'));
const Teleconsult = lazy(() => import('./pages/Teleconsult'));
const Emergency = lazy(() => import('./pages/Emergency'));
const ScheduleTest = lazy(() => import('./pages/ScheduleTest'));
const HealthMetrics = lazy(() => import('./pages/HealthMetrics'));
const DietPlan = lazy(() => import('./pages/DietPlan'));
const ExerciseLog = lazy(() => import('./pages/ExerciseLog'));
const VaccinationSchedule = lazy(() => import('./pages/VaccinationSchedule'));
const HealthArticles = lazy(() => import('./pages/HealthArticles'));
const HealthProfile = lazy(() => import('./pages/HealthProfile'));
const Appointments = lazy(() => import('./pages/Appointments'));
const MyReports = lazy(() => import('./pages/MyReports'));
const MedicinesUsed = lazy(() => import('./pages/MedicinesUsed'));
const HospitalSearch = lazy(() => import('./pages/HospitalSearch'));
const Index = lazy(() => import('./pages/Index'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const AIAssistant = lazy(() => import('./pages/AiAssistant'));
const NetworkError = lazy(() => import('./pages/NetworkError'));
const HospitalDetails = lazy(() => import('./pages/HospitalDetails'));
const DoctorDetails = lazy(() => import('./pages/DoctorDetails'));
const TestDetailsPage = lazy(() => import ('./pages/TestDetailsPage'))
const ReportAnalysis = lazy(() => import ('./pages/ReportAnalysis'))  
const LabDetails = lazy(() => import('./pages/LabDetails'));
const AppointmentDetails = lazy(() => import('./pages/doctor/AppointmentDetails'));

// Hospital related imports
const HospitalLayout = lazy(() => import('./components/hospital/HospitalLayout'));
const HospitalHome = lazy(() => import('./pages/hospital/HospitalHome'));
const HospitalTests = lazy(() => import('./pages/hospital/HospitalTests'));
const HospitalPatients = lazy(() => import('./pages/hospital/HospitalPatients'));
const HospitalSignIn = lazy(() => import('./pages/hospital/HospitalSignIn'));
const HospitalSignUp = lazy(() => import('./pages/hospital/HospitalSignUp'));
const HospitalBilling = lazy(() => import('./pages/hospital/HospitalBilling'));
const HospitalReports = lazy(() => import('./pages/hospital/HospitalReports'));
const HospitalStaff = lazy(() => import('./pages/hospital/HospitalStaff'));
const HospitalSettings = lazy(() => import('./pages/hospital/HospitalSettings'));

// Doctor related imports
const DoctorLayout = lazy(() => import('./components/doctor/DoctorLayout'));
const DoctorHome = lazy(() => import('./pages/doctor/DoctorHome'));
const DoctorSignIn = lazy(() => import('./pages/doctor/DoctorSignIn'));
const DoctorAppointments = lazy(() => import('./pages/doctor/DoctorAppointments'));

// Lab related imports
const LabLayout = lazy(() => import('./components/lab/LabLayout'));
const LabHome = lazy(() => import('./pages/lab/LabHome'));
const LabSignIn = lazy(() => import('./pages/lab/LabSignIn'));
const LabTests = lazy(() => import('./pages/lab/LabTests'));
const LabReports = lazy(() => import('./pages/lab/LabReports'));
const LabPatients = lazy(() => import('./pages/lab/LabPatients'));
const LabAppointments = lazy(() => import('./pages/lab/LabAppointments'));
const LabAnalytics = lazy(() => import('./pages/lab/LabAnalytics'));
const LabSettings = lazy(() => import('./pages/lab/LabSettings'));

const PublicLayout = ({ children }) => (
  <div className='w-full'>{children}</div>
);

const App = () => {
  return (
    <div className='w-full'>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/network-error" element={<NetworkError />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Layout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="tests" element={<MedicalTestsPage />} />
            <Route path="medication-reminders" element={<MedicationReminders />} />
            <Route path="teleconsult" element={<Teleconsult />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="schedule-test" element={<ScheduleTest />} />
            <Route path="health-metrics" element={<HealthMetrics />} />
            <Route path="diet-plan" element={<DietPlan />} />
            <Route path="exercise-log" element={<ExerciseLog />} />
            <Route path="vaccination-schedule" element={<VaccinationSchedule />} />
            <Route path="health-articles" element={<HealthArticles />} />
            <Route path="health-profile" element={<HealthProfile />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="my-reports" element={<MyReports />} />
            <Route path="medicines-used" element={<MedicinesUsed />} />
            <Route path="hospital-search" element={<HospitalSearch />} />
            <Route path="hospital/:id" element={<HospitalDetails />} />
            <Route path="doctor/:id" element={<DoctorDetails />} />
            <Route path="lab/:labId" element={<LabDetails />} />
            <Route path="test/:id" element={<TestDetailsPage />} /> 
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="report-analysis" element={<ReportAnalysis />} />
          </Route>

          {/* Hospital Routes */}
          <Route 
            path="/hospital" 
            element={
              <HospitalProvider>
                <HospitalLayout />
              </HospitalProvider>
            }
          >
            {/* Public hospital routes */}
            <Route path="signin" element={<HospitalSignIn />} />
            <Route path="signup" element={<HospitalSignUp />} />
            
            {/* Protected hospital routes */}
            <Route path="home" element={
              <ProtectedHospitalRoute>
                <HospitalHome />
              </ProtectedHospitalRoute>
            } />
            <Route path="doctors" element={
              <ProtectedHospitalRoute>
                <HospitalDoctors />
              </ProtectedHospitalRoute>
            } />
            <Route path="tests" element={
              <ProtectedHospitalRoute>
                <HospitalTests />
              </ProtectedHospitalRoute>
            } />
            <Route path="patients" element={
              <ProtectedHospitalRoute>
                <HospitalPatients />
              </ProtectedHospitalRoute>
            } />
            <Route path="billing" element={
              <ProtectedHospitalRoute>
                <HospitalBilling />
              </ProtectedHospitalRoute>
            } />
            <Route path="reports" element={
              <ProtectedHospitalRoute>
                <HospitalReports />
              </ProtectedHospitalRoute>
            } />
            <Route path="staff" element={
              <ProtectedHospitalRoute>
                <HospitalStaff />
              </ProtectedHospitalRoute>
            } />
            <Route path="settings" element={
              <ProtectedHospitalRoute>
                <HospitalSettings />
              </ProtectedHospitalRoute>
            } />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={
            <DoctorProvider>
              <DoctorLayout />
            </DoctorProvider>
          }>
            <Route path="signin/:doctorId" element={<DoctorSignIn />} />
            <Route path="home" element={<DoctorHome />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="appointments/:appointmentId" element={<AppointmentDetails />} />
          </Route>

          {/* Lab Routes */}
          <Route path="/lab" element={<LabLayout />}>
            <Route path="signin" element={<LabSignIn />} />
            <Route path="signup" element={<LabSignUp />} />
            <Route path="home" element={
              <ProtectedRoute>
                <LabHome />
              </ProtectedRoute>
            } />
            <Route path="tests" element={
              <ProtectedRoute>
                <LabTests />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute>
                <LabReports />
              </ProtectedRoute>
            } />
            <Route path="patients" element={
              <ProtectedRoute>
                <LabPatients />
              </ProtectedRoute>
            } />
            <Route path="appointments" element={
              <ProtectedRoute>
                <LabAppointments />
              </ProtectedRoute>
            } />
            <Route path="analytics" element={
              <ProtectedRoute>
                <LabAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/lab/tests/:testId" element={
              <ProtectedRoute>
                <TestDetails />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <PrivateRoute>
                <LabSettings />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
