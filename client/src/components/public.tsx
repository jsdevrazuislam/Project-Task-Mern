import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/auth-context"

interface PublicRouteProps {
  restricted?: boolean 
}

const PublicRoute = ({ restricted = false }: PublicRouteProps) => {
  const { accessToken } = useAuth()

  if (restricted && accessToken) {
    return <Navigate to="/events" />
  }

  return <Outlet />
}

export default PublicRoute
