import { registrationApi } from "../api/registrationApi.js";
import { studentApi } from "../../student/api/studentApi.js";
import { thesisApi } from "../../thesis/api/thesisApi.js";
import {
  validateRegistration,
  toRegistrationPayload,
  fromRegistrationResponse,
} from "../dto/registration.dto.js";

export const registrationCompositeService = {
  async loadDashboardData() {
    const [regsRes, studentsRes, thesesRes] = await Promise.allSettled([
      registrationApi.getAll(),
      studentApi.getAll(),
      thesisApi.getAll(),
    ]);

    const rawStudents =
      studentsRes.status === "fulfilled" && Array.isArray(studentsRes.value)
        ? studentsRes.value
        : [];
    const rawTheses =
      thesesRes.status === "fulfilled" && Array.isArray(thesesRes.value)
        ? thesesRes.value
        : [];
    const rawRegs =
      regsRes.status === "fulfilled" && Array.isArray(regsRes.value)
        ? regsRes.value
        : [];

    const studentMap = new Map(
      rawStudents.map((s) => [s.studentId || s.id, s.fullName]),
    );
    const thesisMap = new Map(rawTheses.map((t) => [t.id, t.title]));

    const registrations = rawRegs.map((r) => {
      const normalized = fromRegistrationResponse(r) || r;
      return {
        ...normalized,
        studentName:
          normalized.studentName ||
          studentMap.get(normalized.studentId) ||
          normalized.studentId,
        thesisTitle:
          normalized.thesisTitle ||
          thesisMap.get(normalized.thesisId) ||
          normalized.thesisId,
      };
    });

    const failedServices = [];
    if (regsRes.status === "rejected") {
      failedServices.push("registration-service");
    }
    if (studentsRes.status === "rejected") {
      failedServices.push("student-service");
    }
    if (thesesRes.status === "rejected") {
      failedServices.push("thesis-service");
    }

    const warningMessage =
      failedServices.length > 0
        ? `Không thể kết nối đến: ${failedServices.join(", ")}. Hãy kiểm tra các service đang chạy.`
        : null;

    return {
      registrations,
      students: rawStudents,
      theses: rawTheses,
      failedServices,
      warningMessage,
    };
  },

  async registerThesis(data) {
    const validation = validateRegistration(data);
    if (!validation.valid) {
      throw new Error(validation.errors[0]);
    }
    const payload = toRegistrationPayload(data);
    return await registrationApi.create(payload);
  },

  async updateRegistrationStatus(id, status) {
    if (!id) {
      throw new Error("Mã đăng ký không hợp lệ.");
    }
    const cleanStatus = String(status ?? "").trim();
    if (!cleanStatus) {
      throw new Error("Trạng thái không được để trống.");
    }
    return await registrationApi.updateStatus(id, cleanStatus);
  },

  async deleteRegistration(id) {
    if (!id) {
      throw new Error("Mã đăng ký không hợp lệ.");
    }
    return await registrationApi.delete(id);
  },
};
