import { Navigate } from 'react-router-dom';
import { isLabAuthenticated } from '../utils/authUtils';

const PrivateRoute = ({ children }) => {
  const authenticated = isLabAuthenticated();

  if (!authenticated) {
    return <Navigate to="/lab/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
