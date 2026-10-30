
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, getToken } from "../utils/auth";

function AdminRoute({ children }) {
  const location = useLocation();
  const user = getCurrentUser();
  const token = getToken();

  if (!user || !token) {
    return (
      <Navigate
        to="/auth"
        state={{ from: location }}
        replace
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
