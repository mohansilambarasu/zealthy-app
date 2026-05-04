import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/index";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      loginUser(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Z</div>
        <h1 style={styles.title}>Zealthy Patient Portal</h1>
        <p style={styles.subtitle}>
          Sign in to view your appointments and medications
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.hint}>
          Are you a provider?{" "}
          <a href="/admin" style={styles.link}>
            Go to Admin EMR
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "28px",
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "14px",
    marginBottom: "16px",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    textAlign: "left",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    marginTop: "8px",
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  hint: {
    marginTop: "24px",
    fontSize: "13px",
    color: "#6b7280",
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "500",
  },
};
