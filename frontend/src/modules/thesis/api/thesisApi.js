import { httpClient } from "../../../core/http/httpClient.js";
import { API_BASE } from "../../../core/gateway/config.js";

export const thesisApi = {
  getAll() {
    return httpClient.get(API_BASE.THESIS);
  },

  getById(id) {
    return httpClient.get(`${API_BASE.THESIS}/${encodeURIComponent(id)}`);
  },

  create(thesis) {
    return httpClient.post(API_BASE.THESIS, thesis);
  },

  update(id, thesis) {
    return httpClient.put(
      `${API_BASE.THESIS}/${encodeURIComponent(id)}`,
      thesis,
    );
  },

  delete(id) {
    return httpClient.delete(`${API_BASE.THESIS}/${encodeURIComponent(id)}`);
  },
};
