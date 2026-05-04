import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAppointments, getPrescriptions } from "../api/index";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, rxRes] = await Promise.all([
          getAppointments(user.id),
          getPrescriptions(user.id),
        ]);
        setAppointments(apptRes.data);
        setPrescriptions(rxRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  // Filter: only within next 7 days
  const now = new Date();
  const in7Days = new Date();
  in7Days.setDate(now.getDate() + 7);

  const upcomingAppointments = appointments.filter((a) => {
    const d = new Date(a.datetime);
    return d >= now && d <= in7Days;
  });

  const upcomingRefills = prescriptions.filter((r) => {
    const d = new Date(r.refill_on);
    return d >= now && d <= in7Days;
  });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      {/* Top navbar */}
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
          <Link to="/prescriptions" style={styles.navLink}>
            Prescriptions
          </Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        {/* Welcome banner */}
        <div style={styles.banner}>
          <div>
            <h1 style={styles.bannerTitle}>Welcome back, {user.name}</h1>
            <p style={styles.bannerSub}>
              Here's your health summary for the next 7 days
            </p>
          </div>
          <div style={styles.bannerEmail}>{user.email}</div>
        </div>

        {/* Summary cards */}
        <div style={styles.cardRow}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryNum}>{upcomingAppointments.length}</div>
            <div style={styles.summaryLabel}>Upcoming appointments</div>
            <div style={styles.summaryHint}>in the next 7 days</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryNum}>{upcomingRefills.length}</div>
            <div style={styles.summaryLabel}>Medication refills</div>
            <div style={styles.summaryHint}>due in the next 7 days</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryNum}>{prescriptions.length}</div>
            <div style={styles.summaryLabel}>Active prescriptions</div>
            <div style={styles.summaryHint}>total on file</div>
          </div>
        </div>

        <div style={styles.twoCol}>
          {/* Upcoming appointments */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Appointments this week</h2>
              <Link to="/appointments" style={styles.seeAll}>
                See all
              </Link>
            </div>
            {upcomingAppointments.length === 0 ? (
              <div style={styles.empty}>No appointments in the next 7 days</div>
            ) : (
              upcomingAppointments.map((a) => (
                <div key={a._id} style={styles.item}>
                  <div style={styles.itemDot} />
                  <div>
                    <div style={styles.itemTitle}>{a.provider}</div>
                    <div style={styles.itemSub}>
                      {formatDate(a.datetime)} at {formatTime(a.datetime)}
                    </div>
                    <div style={styles.badge}>{a.repeat}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Upcoming refills */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Refills this week</h2>
              <Link to="/prescriptions" style={styles.seeAll}>
                See all
              </Link>
            </div>
            {upcomingRefills.length === 0 ? (
              <div style={styles.empty}>No refills due in the next 7 days</div>
            ) : (
              upcomingRefills.map((r) => (
                <div key={r._id} style={styles.item}>
                  <div style={styles.itemDotGreen} />
                  <div>
                    <div style={styles.itemTitle}>{r.medication}</div>
                    <div style={styles.itemSub}>
                      {r.dosage} · Qty: {r.quantity} · Refill:{" "}
                      {formatDate(r.refill_on)}
                    </div>
                    <div style={styles.badgeGreen}>{r.refill_schedule}</div>
                  </div>
                </div>
              ))
            )}
          </div>
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

  // Navbar
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

  // Container
  container: { maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" },

  // Banner
  banner: {
    backgroundColor: "#4f46e5",
    borderRadius: "16px",
    padding: "28px 32px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "4px",
  },
  bannerSub: { fontSize: "14px", color: "#c7d2fe" },
  bannerEmail: {
    fontSize: "13px",
    color: "#c7d2fe",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "6px 14px",
    borderRadius: "20px",
  },

  // Summary cards
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  summaryNum: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: "4px",
  },
  summaryLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111",
    marginBottom: "2px",
  },
  summaryHint: { fontSize: "12px", color: "#9ca3af" },

  // Two column layout
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionTitle: { fontSize: "15px", fontWeight: "600", color: "#111" },
  seeAll: {
    fontSize: "13px",
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "500",
  },
  empty: { fontSize: "14px", color: "#9ca3af", padding: "12px 0" },

  // List items
  item: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  itemDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    marginTop: "4px",
    flexShrink: 0,
  },
  itemDotGreen: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    marginTop: "4px",
    flexShrink: 0,
  },
  itemTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111",
    marginBottom: "2px",
  },
  itemSub: { fontSize: "13px", color: "#6b7280", marginBottom: "4px" },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  badgeGreen: {
    display: "inline-block",
    fontSize: "11px",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "500",
  },
};
