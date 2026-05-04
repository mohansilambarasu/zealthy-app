import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPatient,
  updatePatient,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getMedications,
} from "../api/index";

const EMPTY_APPT = {
  provider: "",
  datetime: "",
  repeat: "none",
  repeatEndsAt: "",
  notes: "",
};
const EMPTY_RX = {
  medication: "",
  dosage: "",
  quantity: 1,
  refill_on: "",
  refill_schedule: "monthly",
};

export default function AdminPatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Patient edit
  const [editingPatient, setEditingPatient] = useState(false);
  const [patientForm, setPatientForm] = useState({});

  // Appointment form
  const [apptForm, setApptForm] = useState(EMPTY_APPT);
  const [editingAppt, setEditingAppt] = useState(null);
  const [showApptForm, setShowApptForm] = useState(false);

  // Prescription form
  const [rxForm, setRxForm] = useState(EMPTY_RX);
  const [editingRx, setEditingRx] = useState(null);
  const [showRxForm, setShowRxForm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, aRes, rRes, mRes] = await Promise.all([
          getPatient(id),
          getAppointments(id),
          getPrescriptions(id),
          getMedications(),
        ]);
        setPatient(pRes.data);
        setPatientForm(pRes.data);
        setAppointments(aRes.data);
        setPrescriptions(rRes.data);
        setMedications(mRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Patient ──────────────────────────────────────────────
  const handlePatientSave = async () => {
    setSaving(true);
    try {
      const res = await updatePatient(id, patientForm);
      setPatient(res.data);
      setEditingPatient(false);
    } catch (err) {
      setError("Failed to update patient");
    } finally {
      setSaving(false);
    }
  };

  // ── Appointments ─────────────────────────────────────────
  const openNewAppt = () => {
    setEditingAppt(null);
    setApptForm(EMPTY_APPT);
    setShowApptForm(true);
  };

  const openEditAppt = (a) => {
    setEditingAppt(a._id);
    setApptForm({
      provider: a.provider,
      datetime: a.datetime
        ? new Date(a.datetime).toISOString().slice(0, 16)
        : "",
      repeat: a.repeat,
      repeatEndsAt: a.repeatEndsAt
        ? new Date(a.repeatEndsAt).toISOString().slice(0, 10)
        : "",
      notes: a.notes || "",
    });
    setShowApptForm(true);
  };

  const handleApptSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...apptForm, userId: id };
      if (editingAppt) {
        const res = await updateAppointment(editingAppt, payload);
        setAppointments(
          appointments.map((a) => (a._id === editingAppt ? res.data : a)),
        );
      } else {
        const res = await createAppointment(payload);
        setAppointments([...appointments, res.data]);
      }
      setShowApptForm(false);
      setApptForm(EMPTY_APPT);
      setEditingAppt(null);
    } catch (err) {
      setError("Failed to save appointment");
    } finally {
      setSaving(false);
    }
  };

  const handleApptDelete = async (apptId) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(apptId);
      setAppointments(appointments.filter((a) => a._id !== apptId));
    } catch (err) {
      setError("Failed to delete appointment");
    }
  };

  // ── Prescriptions ─────────────────────────────────────────
  const openNewRx = () => {
    setEditingRx(null);
    setRxForm(EMPTY_RX);
    setShowRxForm(true);
  };

  const openEditRx = (r) => {
    setEditingRx(r._id);
    setRxForm({
      medication: r.medication,
      dosage: r.dosage,
      quantity: r.quantity,
      refill_on: r.refill_on
        ? new Date(r.refill_on).toISOString().slice(0, 10)
        : "",
      refill_schedule: r.refill_schedule,
    });
    setShowRxForm(true);
  };

  const handleRxSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...rxForm, userId: id };
      if (editingRx) {
        const res = await updatePrescription(editingRx, payload);
        setPrescriptions(
          prescriptions.map((r) => (r._id === editingRx ? res.data : r)),
        );
      } else {
        const res = await createPrescription(payload);
        setPrescriptions([...prescriptions, res.data]);
      }
      setShowRxForm(false);
      setRxForm(EMPTY_RX);
      setEditingRx(null);
    } catch (err) {
      setError("Failed to save prescription");
    } finally {
      setSaving(false);
    }
  };

  const handleRxDelete = async (rxId) => {
    if (!window.confirm("Delete this prescription?")) return;
    try {
      await deletePrescription(rxId);
      setPrescriptions(prescriptions.filter((r) => r._id !== rxId));
    } catch (err) {
      setError("Failed to delete prescription");
    }
  };

  // ── Helpers ───────────────────────────────────────────────
  const selectedMedDosages =
    medications.find((m) => m.name === rxForm.medication)?.dosages || [];

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  const fmtDT = (d) =>
    d
      ? new Date(d).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "—";

  if (loading) return <div style={s.loading}>Loading...</div>;
  if (!patient) return <div style={s.loading}>Patient not found</div>;

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <div style={s.logoBox}>Z</div>
          <div>
            <div style={s.navTitle}>Zealthy Admin</div>
            <div style={s.navSub}>EMR System</div>
          </div>
        </div>
        <button onClick={() => navigate("/admin")} style={s.backBtn}>
          ← All Patients
        </button>
      </nav>

      <div style={s.container}>
        {error && <div style={s.error}>{error}</div>}

        {/* ── Patient Info ── */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardHeaderLeft}>
              <div style={s.bigAvatar}>{patient.name[0]}</div>
              <div>
                <h1 style={s.patientName}>{patient.name}</h1>
                <div style={s.patientEmail}>{patient.email}</div>
              </div>
            </div>
            <button
              style={editingPatient ? s.cancelBtn : s.editBtn}
              onClick={() => setEditingPatient(!editingPatient)}
            >
              {editingPatient ? "Cancel" : "Edit Info"}
            </button>
          </div>

          {editingPatient ? (
            <div style={s.editForm}>
              <div style={s.formGrid}>
                <div style={s.field}>
                  <label style={s.label}>Full Name</label>
                  <input
                    style={s.input}
                    value={patientForm.name || ""}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, name: e.target.value })
                    }
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Email</label>
                  <input
                    style={s.input}
                    value={patientForm.email || ""}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, email: e.target.value })
                    }
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>New Password</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="Leave blank to keep current"
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Date of Birth</label>
                  <input
                    style={s.input}
                    type="date"
                    value={patientForm.dateOfBirth || ""}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Phone</label>
                  <input
                    style={s.input}
                    value={patientForm.phone || ""}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div style={s.formActions}>
                <button
                  style={s.saveBtn}
                  onClick={handlePatientSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div style={s.infoGrid}>
              <div style={s.infoItem}>
                <div style={s.infoLabel}>Date of Birth</div>
                <div style={s.infoValue}>{fmt(patient.dateOfBirth)}</div>
              </div>
              <div style={s.infoItem}>
                <div style={s.infoLabel}>Phone</div>
                <div style={s.infoValue}>{patient.phone || "—"}</div>
              </div>
              <div style={s.infoItem}>
                <div style={s.infoLabel}>Member Since</div>
                <div style={s.infoValue}>{fmt(patient.createdAt)}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Appointments ── */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>
              Appointments
              <span style={s.countBadge}>{appointments.length}</span>
            </h2>
            <button style={s.addBtn} onClick={openNewAppt}>
              + Add Appointment
            </button>
          </div>

          {showApptForm && (
            <form onSubmit={handleApptSave} style={s.inlineForm}>
              <div style={s.formGrid}>
                <div style={s.field}>
                  <label style={s.label}>Provider Name *</label>
                  <input
                    style={s.input}
                    value={apptForm.provider}
                    onChange={(e) =>
                      setApptForm({ ...apptForm, provider: e.target.value })
                    }
                    placeholder="Dr. Jane Smith"
                    required
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Date & Time *</label>
                  <input
                    style={s.input}
                    type="datetime-local"
                    value={apptForm.datetime}
                    onChange={(e) =>
                      setApptForm({ ...apptForm, datetime: e.target.value })
                    }
                    required
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Repeat Schedule</label>
                  <select
                    style={s.input}
                    value={apptForm.repeat}
                    onChange={(e) =>
                      setApptForm({ ...apptForm, repeat: e.target.value })
                    }
                  >
                    <option value="none">No repeat</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                {apptForm.repeat !== "none" && (
                  <div style={s.field}>
                    <label style={s.label}>Repeat Ends On</label>
                    <input
                      style={s.input}
                      type="date"
                      value={apptForm.repeatEndsAt}
                      onChange={(e) =>
                        setApptForm({
                          ...apptForm,
                          repeatEndsAt: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <div style={s.field}>
                  <label style={s.label}>Notes</label>
                  <input
                    style={s.input}
                    value={apptForm.notes}
                    onChange={(e) =>
                      setApptForm({ ...apptForm, notes: e.target.value })
                    }
                    placeholder="Optional notes"
                  />
                </div>
              </div>
              <div style={s.formActions}>
                <button
                  type="button"
                  style={s.cancelBtn}
                  onClick={() => {
                    setShowApptForm(false);
                    setEditingAppt(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" style={s.saveBtn} disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingAppt
                      ? "Update Appointment"
                      : "Add Appointment"}
                </button>
              </div>
            </form>
          )}

          {appointments.length === 0 && !showApptForm ? (
            <div style={s.empty}>No appointments yet.</div>
          ) : (
            appointments.map((a) => (
              <div key={a._id} style={s.listItem}>
                <div style={s.listItemLeft}>
                  <div style={s.listTitle}>{a.provider}</div>
                  <div style={s.listSub}>{fmtDT(a.datetime)}</div>
                  {a.notes && <div style={s.listNotes}>{a.notes}</div>}
                  {a.repeatEndsAt && (
                    <div style={s.listNotes}>Ends: {fmt(a.repeatEndsAt)}</div>
                  )}
                </div>
                <div style={s.listItemRight}>
                  <span style={s.repeatBadge}>{a.repeat}</span>
                  <button style={s.editSmBtn} onClick={() => openEditAppt(a)}>
                    Edit
                  </button>
                  <button
                    style={s.delSmBtn}
                    onClick={() => handleApptDelete(a._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Prescriptions ── */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>
              Prescriptions
              <span style={s.countBadge}>{prescriptions.length}</span>
            </h2>
            <button style={s.addBtn} onClick={openNewRx}>
              + Add Prescription
            </button>
          </div>

          {showRxForm && (
            <form onSubmit={handleRxSave} style={s.inlineForm}>
              <div style={s.formGrid}>
                <div style={s.field}>
                  <label style={s.label}>Medication *</label>
                  <select
                    style={s.input}
                    value={rxForm.medication}
                    onChange={(e) =>
                      setRxForm({
                        ...rxForm,
                        medication: e.target.value,
                        dosage: "",
                      })
                    }
                    required
                  >
                    <option value="">Select medication</option>
                    {medications.map((m) => (
                      <option key={m._id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Dosage *</label>
                  <select
                    style={s.input}
                    value={rxForm.dosage}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, dosage: e.target.value })
                    }
                    required
                    disabled={!rxForm.medication}
                  >
                    <option value="">Select dosage</option>
                    {selectedMedDosages.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Quantity *</label>
                  <input
                    style={s.input}
                    type="number"
                    min="1"
                    value={rxForm.quantity}
                    onChange={(e) =>
                      setRxForm({
                        ...rxForm,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Refill Date *</label>
                  <input
                    style={s.input}
                    type="date"
                    value={rxForm.refill_on}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, refill_on: e.target.value })
                    }
                    required
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Refill Schedule</label>
                  <select
                    style={s.input}
                    value={rxForm.refill_schedule}
                    onChange={(e) =>
                      setRxForm({ ...rxForm, refill_schedule: e.target.value })
                    }
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>
              <div style={s.formActions}>
                <button
                  type="button"
                  style={s.cancelBtn}
                  onClick={() => {
                    setShowRxForm(false);
                    setEditingRx(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" style={s.saveBtn} disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingRx
                      ? "Update Prescription"
                      : "Add Prescription"}
                </button>
              </div>
            </form>
          )}

          {prescriptions.length === 0 && !showRxForm ? (
            <div style={s.empty}>No prescriptions yet.</div>
          ) : (
            prescriptions.map((r) => (
              <div key={r._id} style={s.listItem}>
                <div style={s.listItemLeft}>
                  <div style={s.listTitle}>
                    {r.medication} — {r.dosage}
                  </div>
                  <div style={s.listSub}>
                    Qty: {r.quantity} · Refill: {fmt(r.refill_on)} ·{" "}
                    {r.refill_schedule}
                  </div>
                </div>
                <div style={s.listItemRight}>
                  <button style={s.editSmBtn} onClick={() => openEditRx(r)}>
                    Edit
                  </button>
                  <button
                    style={s.delSmBtn}
                    onClick={() => handleRxDelete(r._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
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
  backBtn: {
    background: "none",
    border: "1px solid #4f46e5",
    color: "#a5b4fc",
    borderRadius: "8px",
    padding: "7px 16px",
    fontSize: "13px",
    cursor: "pointer",
  },
  container: { maxWidth: "900px", margin: "0 auto", padding: "32px 24px" },
  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "14px",
    marginBottom: "16px",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  cardHeaderLeft: { display: "flex", alignItems: "center", gap: "16px" },
  bigAvatar: {
    width: "52px",
    height: "52px",
    backgroundColor: "#ede9fe",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    color: "#6d28d9",
    flexShrink: 0,
  },
  patientName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "2px",
  },
  patientEmail: { fontSize: "14px", color: "#6b7280" },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  infoItem: { display: "flex", flexDirection: "column", gap: "4px" },
  infoLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  infoValue: { fontSize: "14px", color: "#111", fontWeight: "500" },

  editForm: { marginTop: "16px" },
  inlineForm: {
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "16px",
    border: "1px solid #e5e7eb",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginBottom: "16px",
  },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", fontWeight: "500", color: "#374151" },
  input: {
    padding: "8px 11px",
    borderRadius: "7px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#fff",
  },
  formActions: { display: "flex", gap: "10px", justifyContent: "flex-end" },
  saveBtn: {
    padding: "8px 20px",
    borderRadius: "7px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "8px 16px",
    borderRadius: "7px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#fff",
    fontSize: "13px",
    cursor: "pointer",
    color: "#6b7280",
  },
  editBtn: {
    padding: "8px 16px",
    borderRadius: "7px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#fff",
    fontSize: "13px",
    cursor: "pointer",
    color: "#4f46e5",
    fontWeight: "500",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111",
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
  addBtn: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    padding: "7px 16px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  empty: { fontSize: "14px", color: "#9ca3af", padding: "12px 0" },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  listItemLeft: { flex: 1 },
  listItemRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  listTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "2px",
  },
  listSub: { fontSize: "13px", color: "#6b7280" },
  listNotes: {
    fontSize: "12px",
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: "2px",
  },
  repeatBadge: {
    fontSize: "11px",
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
    padding: "3px 10px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  editSmBtn: {
    fontSize: "12px",
    backgroundColor: "#f5f3ff",
    color: "#6d28d9",
    border: "none",
    borderRadius: "6px",
    padding: "5px 12px",
    cursor: "pointer",
    fontWeight: "500",
  },
  delSmBtn: {
    fontSize: "12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "none",
    borderRadius: "6px",
    padding: "5px 12px",
    cursor: "pointer",
    fontWeight: "500",
  },
};
