import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import useAuth from "../../auth/useAuth";
import ApplicantDashboard from "./ApplicantDashboard";
import MemberDashboard from "./MemberDashboard";
import AdminDashboard from "./AdminDashboard";
import { maximum } from "firebase/firestore/pipelines";

type Role = "applicant" | "member" | "admin";

function getRoleFromClaims(claims: unknown): Role {
  const role = (claims as any)?.role;
  if (role === "admin" || role === "member" || role === "applicant") return role;
  return "applicant"; // default until promoted
}

export default function Dashboard() {
  const { user, claims } = useAuth();
  const role = getRoleFromClaims(claims);

  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <div>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: 16,
          borderBottom: "1px solid rgba(0,0,0,0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <strong>{user?.email ?? "Signed in"}</strong>
          <div style={{ opacity: 0.7, fontSize: 14 }}>Role: {role}</div>
        </div>

        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      {role === "admin" ? (
        <AdminDashboard />
      ) : role === "member" ? (
        <MemberDashboard />
      ) : (
        <ApplicantDashboard />
      )}
    </div>
  );
}
