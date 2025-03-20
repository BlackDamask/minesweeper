import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { ReactNode, useContext } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const auth = useContext(AuthContext);

  return auth?.user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
