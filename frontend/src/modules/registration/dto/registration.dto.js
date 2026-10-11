export function validateRegistration(data) {
  const errors = [];

  const studentId = String(data?.studentId ?? "").trim();
  const thesisId = String(data?.thesisId ?? "").trim();

  if (!studentId) {
    errors.push("Vui lòng chọn sinh viên đăng ký.");
  }
  if (!thesisId) {
    errors.push("Vui lòng chọn đề tài đồ án tốt nghiệp.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function toRegistrationPayload(data) {
  return {
    studentId: String(data?.studentId ?? "").trim(),
    thesisId: String(data?.thesisId ?? "").trim(),
    status: String(data?.status || "REGISTERED").trim(),
  };
}

export function fromRegistrationResponse(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    id: String(raw.id || "").trim(),
    studentId: String(raw.studentId || "").trim(),
    studentName: raw.studentName ? String(raw.studentName).trim() : null,
    thesisId: String(raw.thesisId || "").trim(),
    thesisTitle: raw.thesisTitle ? String(raw.thesisTitle).trim() : null,
    status: raw.status || "REGISTERED",
  };
}
