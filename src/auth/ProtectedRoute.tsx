import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Important: don't decide until Firebase resolves auth state.
  // Otherwise you can "flash" the wrong page on refresh.
  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Loading...</p>
      </main>
    );
  }

  // If not signed in, send them to /login.
  // Pass the current location and return them after login later.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
