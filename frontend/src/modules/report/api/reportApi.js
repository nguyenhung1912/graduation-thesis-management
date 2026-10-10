import { API_BASE } from "../../../core/gateway/config.js";

export const reportApi = {
  getThesisPdfUrl(id) {
    return `${API_BASE.REPORT}/theses/${encodeURIComponent(id)}/pdf`;
  },

  getSummaryPdfUrl() {
    return `${API_BASE.REPORT}/theses/summary/pdf`;
  },

  getHealthUrl() {
    return `${API_BASE.REPORT}/health`;
  },
};
