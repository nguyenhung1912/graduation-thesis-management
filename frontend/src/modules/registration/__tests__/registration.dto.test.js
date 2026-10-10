import { describe, it, expect } from "vitest";
import {
  validateRegistration,
  toRegistrationPayload,
  fromRegistrationResponse,
} from "../dto/registration.dto.js";

describe("Registration DTO & Contract (Unit Tests)", () => {
  it("validates valid registration data", () => {
    const valid = {
      studentId: "SV01",
      thesisId: "DT01",
    };
    const res = validateRegistration(valid);
    expect(res.valid).toBe(true);
  });

  it("detects missing studentId or thesisId", () => {
    const invalid = { studentId: "", thesisId: "" };
    const res = validateRegistration(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBe(2);
  });

  it("prepares registration payload properly with status", () => {
    const data = {
      studentId: "SV01",
      studentName: "Nguyễn Văn Nam",
      thesisId: "DT01",
      thesisTitle: "Hệ thống SOA",
    };
    const payload = toRegistrationPayload(data);
    expect(payload.studentId).toBe("SV01");
    expect(payload.thesisId).toBe("DT01");
    expect(payload.status).toBe("REGISTERED");
  });

  it("normalizes response data from registration-service", () => {
    const raw = {
      id: 1,
      studentId: "SV01",
      thesisId: "DT01",
      status: "REGISTERED",
    };
    const reg = fromRegistrationResponse(raw);
    expect(reg.id).toBe("1");
    expect(reg.studentId).toBe("SV01");
    expect(reg.thesisId).toBe("DT01");
    expect(reg.status).toBe("REGISTERED");
  });
});
