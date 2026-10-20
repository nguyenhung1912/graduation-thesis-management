import { describe, it, expect } from "vitest";
import {
  validateStudent,
  toStudentPayload,
  isStudentEligible,
} from "../dto/student.dto.js";

describe("Student DTO & Contract (Unit Tests)", () => {
  it("validates valid student data successfully", () => {
    const validData = {
      studentId: "SV01",
      fullName: "Nguyễn Văn Nam",
      className: "CNTT01",
      email: "nam@soa.edu.vn",
      gpa: 3.5,
    };
    const res = validateStudent(validData);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("detects invalid student fields and out-of-range GPA", () => {
    const invalidData = {
      studentId: "",
      fullName: "",
      className: "",
      gpa: 5.5,
    };
    const res = validateStudent(invalidData);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThanOrEqual(4);
  });

  it("transforms payload with normalized uppercase ID and trimmed strings", () => {
    const input = {
      studentId: "  sv99  ",
      fullName: "  Lê Văn C  ",
      className: "  KTPM01  ",
      gpa: 3.256,
    };
    const payload = toStudentPayload(input);
    expect(payload.studentId).toBe("SV99");
    expect(payload.fullName).toBe("Lê Văn C");
    expect(payload.className).toBe("KTPM01");
    expect(payload.gpa).toBe(3.26);
    expect(payload.eligible).toBe(true);
  });

  it("calculates eligibility correctly based on GPA threshold (2.5)", () => {
    expect(isStudentEligible({ gpa: 3.0 })).toBe(true);
    expect(isStudentEligible({ gpa: 2.4 })).toBe(false);
    expect(isStudentEligible({ eligible: false, gpa: 3.8 })).toBe(false);
    expect(isStudentEligible(null)).toBe(false);
  });
});
