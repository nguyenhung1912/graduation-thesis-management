import { describe, it, expect, vi, beforeEach } from "vitest";
import { registrationCompositeService } from "../services/registrationCompositeService.js";
import { registrationApi } from "../api/registrationApi.js";
import { studentApi } from "../../student/api/studentApi.js";
import { thesisApi } from "../../thesis/api/thesisApi.js";

describe("registrationCompositeService (SOA Service Aggregator Tests)", () => {
  const mockStudents = [
    { studentId: "SV01", fullName: "Nguyễn Văn Nam", className: "CNTT01", gpa: 3.5, eligible: true },
    { studentId: "SV02", fullName: "Lê Thị Mai", className: "CNTT02", gpa: 2.2, eligible: false },
  ];

  const mockTheses = [
    { id: "DT01", title: "Kiến trúc SOA", instructor: "TS. Nguyễn A", maxStudents: 3, currentStudents: 1 },
    { id: "DT02", title: "Microservices", instructor: "ThS. Trần B", maxStudents: 2, currentStudents: 2 },
  ];

  const mockRegistrations = [
    { id: 1, studentId: "SV01", thesisId: "DT01", status: "REGISTERED" },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("orchestrates and enriches data from all 3 services", async () => {
    vi.spyOn(registrationApi, "getAll").mockResolvedValue(mockRegistrations);
    vi.spyOn(studentApi, "getAll").mockResolvedValue(mockStudents);
    vi.spyOn(thesisApi, "getAll").mockResolvedValue(mockTheses);

    const result = await registrationCompositeService.loadDashboardData();

    expect(registrationApi.getAll).toHaveBeenCalledTimes(1);
    expect(studentApi.getAll).toHaveBeenCalledTimes(1);
    expect(thesisApi.getAll).toHaveBeenCalledTimes(1);

    expect(result.registrations).toHaveLength(1);
    expect(result.registrations[0].studentName).toBe("Nguyễn Văn Nam");
    expect(result.registrations[0].thesisTitle).toBe("Kiến trúc SOA");
    expect(result.failedServices).toHaveLength(0);
    expect(result.warningMessage).toBeNull();
  });

  it("handles partial failure gracefully when student service is down", async () => {
    vi.spyOn(registrationApi, "getAll").mockResolvedValue(mockRegistrations);
    vi.spyOn(studentApi, "getAll").mockRejectedValue(new Error("Timeout"));
    vi.spyOn(thesisApi, "getAll").mockResolvedValue(mockTheses);

    const result = await registrationCompositeService.loadDashboardData();

    expect(result.registrations).toHaveLength(1);
    // Graceful fallback to studentId when student-service is unavailable
    expect(result.registrations[0].studentName).toBe("SV01");
    expect(result.failedServices).toContain("student-service");
    expect(result.warningMessage).toContain("student-service");
  });

  it("validates and calls registrationApi for registerThesis", async () => {
    const createSpy = vi.spyOn(registrationApi, "create").mockResolvedValue({ id: 2 });

    const newReg = {
      studentId: "SV01",
      thesisId: "DT01",
      status: "REGISTERED",
    };
    const res = await registrationCompositeService.registerThesis(newReg);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({ studentId: "SV01", thesisId: "DT01", status: "REGISTERED" })
    );
    expect(res.id).toBe(2);
  });

  it("throws validation error when registering without student or thesis", async () => {
    await expect(
      registrationCompositeService.registerThesis({ studentId: "", thesisId: "" })
    ).rejects.toThrow("sinh viên");
  });

  it("updates registration status via registrationApi.updateStatus", async () => {
    const patchSpy = vi
      .spyOn(registrationApi, "updateStatus")
      .mockResolvedValue({ id: 1, status: "Đã duyệt" });

    const res = await registrationCompositeService.updateRegistrationStatus(1, "Đã duyệt");

    expect(patchSpy).toHaveBeenCalledWith(1, "Đã duyệt");
    expect(res.status).toBe("Đã duyệt");
  });

  it("deletes registration via registrationApi.delete", async () => {
    const deleteSpy = vi.spyOn(registrationApi, "delete").mockResolvedValue(null);

    await registrationCompositeService.deleteRegistration(1);

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});
