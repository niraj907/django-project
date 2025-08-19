import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('auth-store')); 

if (!user) {
  return <Navigate to="/" replace />;
}

  return children;
};

export default ProtectedRoute;
