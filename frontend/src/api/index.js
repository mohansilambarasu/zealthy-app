import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://zealthy-app.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => api.post("/auth/login", data);

export const getPatients = () => api.get("/patients");
export const getPatient = (id) => api.get(`/patients/${id}`);
export const createPatient = (data) => api.post("/patients", data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);

export const getAppointments = (userId) =>
  api.get(`/appointments/patient/${userId}`);
export const createAppointment = (data) => api.post("/appointments", data);
export const updateAppointment = (id, data) =>
  api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

export const getPrescriptions = (userId) =>
  api.get(`/prescriptions/patient/${userId}`);
export const createPrescription = (data) => api.post("/prescriptions", data);
export const updatePrescription = (id, data) =>
  api.put(`/prescriptions/${id}`, data);
export const deletePrescription = (id) => api.delete(`/prescriptions/${id}`);

export const getMedications = () => api.get("/medications");
