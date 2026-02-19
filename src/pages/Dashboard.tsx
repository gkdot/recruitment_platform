import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import useAuth from "../auth/useAuth";

export default function Dashboard() {
  const { user, claims } = useAuth();

  async function handleSignOut() {
    await signOut(auth);
    // No need to navigate; ProtectedRoute will kick user back to /login automatically
    // when auth state changes and user becomes null.
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <div>
          <strong>Signed in as:</strong> {user?.email ?? "(unknown)"}
        </div>
        <div>
          <strong>Role:</strong> {(claims as any)?.role ?? "applicant (default)"}
        </div>
      </div>

      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </main>
  );
}
