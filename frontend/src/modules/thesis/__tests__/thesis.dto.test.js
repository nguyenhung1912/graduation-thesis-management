import { describe, it, expect } from "vitest";
import {
  validateThesis,
  toThesisPayload,
  isThesisAvailable,
} from "../dto/thesis.dto.js";

describe("Thesis DTO & Contract (Unit Tests)", () => {
  it("validates valid thesis data successfully", () => {
    const validData = {
      id: "DT01",
      title: "Ứng dụng SOA trong quản lý đồ án",
      instructor: "TS. Nguyễn Văn A",
      maxStudents: 3,
    };
    const res = validateThesis(validData);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("detects missing thesis fields and invalid student capacity", () => {
    const invalidData = {
      id: "",
      title: "",
      instructor: "",
      maxStudents: 0,
    };
    const res = validateThesis(invalidData);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThanOrEqual(4);
  });

  it("formats payload with uppercase ID and trimmed strings", () => {
    const input = {
      id: " dt05 ",
      title: "  Kiến trúc Microservices  ",
      instructor: "  ThS. Trần B  ",
      maxStudents: "4",
    };
    const payload = toThesisPayload(input);
    expect(payload.id).toBe("DT05");
    expect(payload.title).toBe("Kiến trúc Microservices");
    expect(payload.instructor).toBe("ThS. Trần B");
    expect(payload.maxStudents).toBe(4);
  });

  it("evaluates availability correctly", () => {
    const available = { maxStudents: 3, currentStudents: 1 };
    const full = { maxStudents: 2, currentStudents: 2 };

    expect(isThesisAvailable(available)).toBe(true);
    expect(isThesisAvailable(full)).toBe(false);
  });
});
