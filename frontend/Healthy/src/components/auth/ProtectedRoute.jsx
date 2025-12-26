import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('labToken');
  
  if (!token) {
    return <Navigate to="/lab/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
