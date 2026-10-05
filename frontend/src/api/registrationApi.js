import { httpClient } from "./httpClient.js";
import { API_BASE } from "./config.js";

export const registrationApi = {
  getAll() {
    return httpClient.get(API_BASE.REGISTRATION);
  },

  getById(id) {
    return httpClient.get(`${API_BASE.REGISTRATION}/${encodeURIComponent(id)}`);
  },

  create(registration) {
    return httpClient.post(API_BASE.REGISTRATION, registration);
  },

  updateScores(id, scores) {
    return httpClient.put(
      `${API_BASE.REGISTRATION}/${encodeURIComponent(id)}/scores`,
      scores,
    );
  },

  delete(id) {
    return httpClient.delete(
      `${API_BASE.REGISTRATION}/${encodeURIComponent(id)}`,
    );
  },
};
