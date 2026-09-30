export const API_BASE = {
  STUDENT:
    import.meta.env.VITE_STUDENT_API_URL ||
    "http://localhost:8081/api/students",
  THESIS:
    import.meta.env.VITE_THESIS_API_URL || "http://localhost:8082/api/theses",
  REGISTRATION:
    import.meta.env.VITE_REGISTRATION_API_URL ||
    "http://localhost:8083/api/registrations",
};
