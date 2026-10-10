import { httpClient } from "../../../core/http/httpClient.js";
import { API_BASE } from "../../../core/gateway/config.js";

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
};
