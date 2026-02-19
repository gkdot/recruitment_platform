import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import "./login.css";

function friendlyAuthError(code?: string) {
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with that email.";
    case "auth/weak-password":
      return "Password is too weak. Try 8+ characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a bit and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const isSignup = mode === "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !submitting;
  }, [email, password, submitting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const trimmedEmail = email.trim();

      if (isSignup) {
        await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      }

      // Important: redirect after auth succeeds. AuthProvider will pick up user state.
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      // Firebase errors usually include a "code" like "auth/invalid-email"
      const message = friendlyAuthError(err?.code);
      setError(message);
      console.error("Auth error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          {isSignup ? "Create your account" : "Sign in"}
        </div>
        <div className="login-subtitle">
          {isSignup
            ? "Use your email to create an account."
            : "Use your email and password to continue."}
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 18 }}>
          <div className="login-field">
            <label style={{ textAlign: "left" }}>Email</label>
            <input
              type="email"
              className="login-input"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label style={{ textAlign: "left" }}>Password</label>
            <input
              type="password"
              className="login-input"
              value={password}
              autoComplete={isSignup ? "new-password" : "current-password"}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="login-primary-btn"
          >
            {submitting
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        <hr className="login-divider" />

        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode(isSignup ? "signin" : "signup");
          }}
          className="login-switch"
        >
          {isSignup
            ? "Already have an account? Sign in"
            : "New here? Create account"}
        </button>
      </div>
    </div>
  );
}
