import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, getToken } from "../utils/auth";
export default function RoleRoute({ roles, children }) {
 const user=getCurrentUser(); const location=useLocation();
 if(!user || !getToken()) return <Navigate to="/auth" state={{from:location}} replace />;
 if(!roles.includes(user.role)) return <Navigate to={user.role === "admin" ? "/dashboard" : user.role === "doctor" ? "/doctor-dashboard" : "/"} replace />;
 return children;
}
