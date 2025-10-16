import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";

const RequireAdmin = ({ children }) => {
  const { isLoggedIn, isAdmin, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) return null; // wait until we know

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RequireAdmin;
