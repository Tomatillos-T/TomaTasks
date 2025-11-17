import { Navigate } from "react-router-dom";

interface RedirectionRouteProps {
  redirect: string;
}

export default function RedirectionRoute({ redirect }: RedirectionRouteProps) {
  return <Navigate to={redirect} replace />;
}
