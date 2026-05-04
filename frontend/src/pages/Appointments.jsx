import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAppointments } from "../api/index";

export default function Appointments() {
  const { user, logoutUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointments(user.id)
      .then((res) => setAppointments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  // Show appointments up to 3 months from today
  const now = new Date();
  const in3Months = new Date();
  in3Months.setMonth(now.getMonth() + 3);

  const upcoming = appointments.filter((a) => {
    const d = new Date(a.datetime);
    return d >= now && d <= in3Months;
  });

  const past = appointments.filter((a) => new Date(a.datetime) < now);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

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
          <Link
            to="/appointments"
            style={{ ...styles.navLink, color: "#4f46e5", fontWeight: "600" }}
          >
            Appointments
          </Link>
          <Link to="/prescriptions" style={styles.navLink}>
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
          <div>
            <h1 style={styles.pageTitle}>My Appointments</h1>
            <p style={styles.pageSub}>
              Showing upcoming appointments for the next 3 months
            </p>
          </div>
        </div>

        {/* Upcoming */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Upcoming
            <span style={styles.countBadge}>{upcoming.length}</span>
          </h2>

          {upcoming.length === 0 ? (
            <div style={styles.empty}>
              No upcoming appointments in the next 3 months.
            </div>
          ) : (
            upcoming.map((a) => (
              <div key={a._id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.dateBox}>
                    <div style={styles.dateMonth}>
                      {new Date(a.datetime).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </div>
                    <div style={styles.dateDay}>
                      {new Date(a.datetime).getDate()}
                    </div>
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardTitle}>{a.provider}</div>
                  <div style={styles.cardSub}>
                    {formatDate(a.datetime)} at {formatTime(a.datetime)}
                  </div>
                  {a.notes && <div style={styles.cardNotes}>{a.notes}</div>}
                </div>
                <div style={styles.cardRight}>
                  <span style={styles.repeatBadge}>{a.repeat}</span>
                  {a.repeatEndsAt && (
                    <div style={styles.endsAt}>
                      Ends {new Date(a.repeatEndsAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div style={styles.section}>
            <h2 style={{ ...styles.sectionTitle, color: "#9ca3af" }}>
              Past
              <span
                style={{
                  ...styles.countBadge,
                  backgroundColor: "#f3f4f6",
                  color: "#9ca3af",
                }}
              >
                {past.length}
              </span>
            </h2>
            {past.map((a) => (
              <div key={a._id} style={{ ...styles.card, opacity: 0.6 }}>
                <div style={styles.cardLeft}>
                  <div
                    style={{ ...styles.dateBox, backgroundColor: "#f3f4f6" }}
                  >
                    <div style={{ ...styles.dateMonth, color: "#9ca3af" }}>
                      {new Date(a.datetime).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </div>
                    <div style={{ ...styles.dateDay, color: "#6b7280" }}>
                      {new Date(a.datetime).getDate()}
                    </div>
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardTitle}>{a.provider}</div>
                  <div style={styles.cardSub}>
                    {formatDate(a.datetime)} at {formatTime(a.datetime)}
                  </div>
                </div>
                <div style={styles.cardRight}>
                  <span
                    style={{
                      ...styles.repeatBadge,
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                    }}
                  >
                    {a.repeat}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
  section: { marginBottom: "32px" },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  countBadge: {
    fontSize: "12px",
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
    padding: "2px 10px",
    borderRadius: "20px",
    fontWeight: "600",
  },
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
    padding: "16px 20px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardLeft: { flexShrink: 0 },
  dateBox: {
    backgroundColor: "#ede9fe",
    borderRadius: "10px",
    padding: "8px 12px",
    textAlign: "center",
    minWidth: "52px",
  },
  dateMonth: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6d28d9",
    textTransform: "uppercase",
  },
  dateDay: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#4f46e5",
    lineHeight: 1,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "2px",
  },
  cardSub: { fontSize: "13px", color: "#6b7280", marginBottom: "4px" },
  cardNotes: { fontSize: "13px", color: "#9ca3af", fontStyle: "italic" },
  cardRight: { flexShrink: 0, textAlign: "right" },
  repeatBadge: {
    display: "inline-block",
    fontSize: "11px",
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
    padding: "3px 10px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  endsAt: { fontSize: "11px", color: "#9ca3af", marginTop: "4px" },
};
