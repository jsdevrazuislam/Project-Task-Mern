import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const PrivateRoute = () => {
  const { accessToken } = useAuth();
  return accessToken ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;