import { httpClient } from "./httpClient.js";
import { API_BASE } from "./config.js";

export const studentApi = {
  getAll() {
    return httpClient.get(API_BASE.STUDENT);
  },

  getById(id) {
    return httpClient.get(`${API_BASE.STUDENT}/${encodeURIComponent(id)}`);
  },

  create(student) {
    return httpClient.post(API_BASE.STUDENT, student);
  },

  update(id, student) {
    return httpClient.put(
      `${API_BASE.STUDENT}/${encodeURIComponent(id)}`,
      student,
    );
  },

  delete(id) {
    return httpClient.delete(`${API_BASE.STUDENT}/${encodeURIComponent(id)}`);
  },

  checkEligibility(id) {
    return httpClient.get(
      `${API_BASE.STUDENT}/${encodeURIComponent(id)}/eligibility`,
    );
  },
};
