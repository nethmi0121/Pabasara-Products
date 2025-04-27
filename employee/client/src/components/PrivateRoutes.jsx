import { useSelector } from "react-redux";
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoutes() {
  const currentUser = useSelector((state) => state.user?.currentUser);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
