import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPrescriptions } from "../api/index";

export default function Prescriptions() {
  const { user, logoutUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrescriptions(user.id)
      .then((res) => setPrescriptions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const isRefillSoon = (refillDate) => {
    const d = new Date(refillDate);
    const now = new Date();
    const in7 = new Date();
    in7.setDate(now.getDate() + 7);
    return d >= now && d <= in7;
  };

  const isOverdue = (refillDate) => new Date(refillDate) < new Date();

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoBox}>Z</div>
          <span style={styles.navTitle}>Zealthy</span>
        </div>
        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.navLink}>
            Dashboard
          </Link>
          <Link to="/appointments" style={styles.navLink}>
            Appointments
          </Link>
          <Link
            to="/prescriptions"
            style={{ ...styles.navLink, color: "#4f46e5", fontWeight: "600" }}
          >
            Prescriptions
          </Link>
          <button
            onClick={() => {
              logoutUser();
              window.location.href = "/";
            }}
            style={styles.logoutBtn}
          >
            Log out
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>My Prescriptions</h1>
          <p style={styles.pageSub}>
            {prescriptions.length} active prescription
            {prescriptions.length !== 1 ? "s" : ""} on file
          </p>
        </div>

        {prescriptions.length === 0 ? (
          <div style={styles.empty}>No prescriptions on file.</div>
        ) : (
          prescriptions.map((rx) => {
            const soon = isRefillSoon(rx.refill_on);
            const overdue = isOverdue(rx.refill_on);
            return (
              <div key={rx._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.medInfo}>
                    <div style={styles.medIcon}>{rx.medication[0]}</div>
                    <div>
                      <div style={styles.medName}>{rx.medication}</div>
                      <div style={styles.medDosage}>
                        {rx.dosage} · Qty: {rx.quantity}
                      </div>
                    </div>
                  </div>
                  <div style={styles.statusArea}>
                    {overdue && (
                      <span style={styles.badgeRed}>Refill overdue</span>
                    )}
                    {soon && !overdue && (
                      <span style={styles.badgeAmber}>Refill soon</span>
                    )}
                    {!soon && !overdue && (
                      <span style={styles.badgeGreen}>On schedule</span>
                    )}
                  </div>
                </div>

                <div style={styles.cardDetails}>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Next refill</span>
                    <span style={styles.detailValue}>
                      {formatDate(rx.refill_on)}
                    </span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Schedule</span>
                    <span style={styles.detailValue}>{rx.refill_schedule}</span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Dosage</span>
                    <span style={styles.detailValue}>{rx.dosage}</span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Quantity</span>
                    <span style={styles.detailValue}>{rx.quantity}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
    backgroundColor: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "60px",
  },
  navLogo: { display: "flex", alignItems: "center", gap: "10px" },
  logoBox: {
    width: "32px",
    height: "32px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  },
  navTitle: { fontWeight: "600", fontSize: "16px", color: "#111" },
  navLinks: { display: "flex", alignItems: "center", gap: "24px" },
  navLink: {
    color: "#6b7280",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "14px",
    color: "#6b7280",
    cursor: "pointer",
  },
  container: { maxWidth: "800px", margin: "0 auto", padding: "32px 24px" },
  pageHeader: { marginBottom: "24px" },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "4px",
  },
  pageSub: { fontSize: "14px", color: "#6b7280" },
  empty: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    fontSize: "14px",
    color: "#9ca3af",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    marginBottom: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  medInfo: { display: "flex", alignItems: "center", gap: "14px" },
  medIcon: {
    width: "44px",
    height: "44px",
    backgroundColor: "#ede9fe",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    color: "#6d28d9",
  },
  medName: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "2px",
  },
  medDosage: { fontSize: "13px", color: "#6b7280" },
  statusArea: { flexShrink: 0 },
  badgeRed: {
    display: "inline-block",
    fontSize: "12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "4px 12px",
    borderRadius: "20px",
    fontWeight: "500",
    border: "1px solid #fecaca",
  },
  badgeAmber: {
    display: "inline-block",
    fontSize: "12px",
    backgroundColor: "#fffbeb",
    color: "#d97706",
    padding: "4px 12px",
    borderRadius: "20px",
    fontWeight: "500",
    border: "1px solid #fde68a",
  },
  badgeGreen: {
    display: "inline-block",
    fontSize: "12px",
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
    padding: "4px 12px",
    borderRadius: "20px",
    fontWeight: "500",
    border: "1px solid #bbf7d0",
  },
  cardDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    borderTop: "1px solid #f3f4f6",
    paddingTop: "16px",
  },
  detail: { display: "flex", flexDirection: "column", gap: "2px" },
  detailLabel: {
    fontSize: "11px",
    color: "#9ca3af",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: "0.05em",
  },
  detailValue: { fontSize: "14px", color: "#111", fontWeight: "500" },
};
