import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients, createPatient } from "../api/index";

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createPatient(form);
      setForm({
        name: "",
        email: "",
        password: "",
        dateOfBirth: "",
        phone: "",
      });
      setShowForm(false);
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create patient");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoBox}>Z</div>
          <div>
            <div style={styles.navTitle}>Zealthy Admin</div>
            <div style={styles.navSub}>EMR System</div>
          </div>
        </div>
        <a href="/" style={styles.portalLink}>
          Go to Patient Portal
        </a>
      </nav>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Patients</h1>
            <p style={styles.pageSub}>
              {patients.length} patients in the system
            </p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Patient"}
          </button>
        </div>

        {/* New patient form */}
        {showForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Create New Patient</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleCreate} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    style={styles.input}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Jane Doe"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email *</label>
                  <input
                    style={styles.input}
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    placeholder="jane@email.com"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Password *</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    placeholder="Set patient password"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Date of Birth</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      setForm({ ...form, dateOfBirth: e.target.value })
                    }
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Phone</label>
                  <input
                    style={styles.input}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="555-123-4567"
                  />
                </div>
              </div>
              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn} disabled={saving}>
                  {saving ? "Creating..." : "Create Patient"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Patients table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Date of Birth</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Member Since</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr
                  key={p._id}
                  style={{
                    ...styles.tr,
                    backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      <div style={styles.avatar}>{p.name[0]}</div>
                      <span style={styles.nameText}>{p.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{p.email}</td>
                  <td style={styles.td}>{formatDate(p.dateOfBirth)}</td>
                  <td style={styles.td}>{p.phone || "—"}</td>
                  <td style={styles.td}>{formatDate(p.createdAt)}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => navigate(`/admin/patients/${p._id}`)}
                    >
                      View record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8" },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "16px",
    color: "#6b7280",
  },
  nav: {
    backgroundColor: "#1e1b4b",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "60px",
  },
  navLogo: { display: "flex", alignItems: "center", gap: "12px" },
  logoBox: {
    width: "36px",
    height: "36px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
  },
  navTitle: { fontWeight: "600", fontSize: "15px", color: "#fff" },
  navSub: { fontSize: "11px", color: "#a5b4fc" },
  portalLink: { fontSize: "13px", color: "#a5b4fc", textDecoration: "none" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "4px",
  },
  pageSub: { fontSize: "14px", color: "#6b7280" },
  addBtn: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  formTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "16px",
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  form: {},
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "20px",
  },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#374151" },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  formActions: { display: "flex", gap: "12px", justifyContent: "flex-end" },
  cancelBtn: {
    padding: "9px 20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    color: "#6b7280",
  },
  saveBtn: {
    padding: "9px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "14px 16px", fontSize: "14px", color: "#374151" },
  nameCell: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "32px",
    height: "32px",
    backgroundColor: "#ede9fe",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6d28d9",
    flexShrink: 0,
  },
  nameText: { fontWeight: "500", color: "#111" },
  viewBtn: {
    backgroundColor: "#f5f3ff",
    color: "#6d28d9",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
};
