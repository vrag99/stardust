import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";

const ProtectedRoute = () => {
  const { isConnected } = useAccount();
  if (!isConnected) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
