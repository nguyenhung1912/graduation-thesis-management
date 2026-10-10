const RAW_GATEWAY = import.meta.env.VITE_API_GATEWAY_URL;
const GATEWAY_URL = typeof RAW_GATEWAY === "string" ? RAW_GATEWAY.trim() : "";

export const API_BASE = {
  STUDENT:
    import.meta.env.VITE_STUDENT_API_URL ||
    (GATEWAY_URL
      ? `${GATEWAY_URL.replace(/\/+$/, "")}/students`
      : "http://localhost:8081/api/students"),
  THESIS:
    import.meta.env.VITE_THESIS_API_URL ||
    (GATEWAY_URL
      ? `${GATEWAY_URL.replace(/\/+$/, "")}/theses`
      : "http://localhost:8082/api/theses"),
  REGISTRATION:
    import.meta.env.VITE_REGISTRATION_API_URL ||
    (GATEWAY_URL
      ? `${GATEWAY_URL.replace(/\/+$/, "")}/registrations`
      : "http://localhost:8083/api/registrations"),
  REPORT:
    import.meta.env.VITE_REPORT_API_URL ||
    (GATEWAY_URL
      ? `${GATEWAY_URL.replace(/\/+$/, "")}/reports`
      : "http://localhost:8084/api/reports"),
};
