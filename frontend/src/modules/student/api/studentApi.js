import { httpClient } from "../../../core/http/httpClient.js";
import { API_BASE } from "../../../core/gateway/config.js";

export const studentApi = {
  getAll() {
    return httpClient.get(API_BASE.STUDENT);
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
};
